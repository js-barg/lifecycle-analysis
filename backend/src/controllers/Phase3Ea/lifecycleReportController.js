// lifecycleReportController_updated.js
// Updated controller that uses the comprehensive report orchestrator

const LifecycleReportOrchestrator = require('../services/lifecycleReportOrchestrator');
const db = require('../database/dbConnection');

const lifecycleReportController = {
  orchestrator: new LifecycleReportOrchestrator(),
  
  /**
   * Generate comprehensive lifecycle report
   */
  async generateLifecycleReport(req, res) {
    const { jobId, eolYearBasis = 'lastDayOfSupport', customerName } = req.body;
    
    if (!jobId) {
      return res.status(400).json({
        success: false,
        error: 'Job ID is required'
      });
    }
    
    try {
      // Validate job exists
      const jobCheck = await db.query(
        'SELECT job_id, customer_name FROM phase3_jobs WHERE job_id = $1',
        [jobId]
      );
      
      if (jobCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Phase 3 job not found'
        });
      }
      
      const actualCustomerName = customerName || jobCheck.rows[0].customer_name || 'Organization';
      
      // Set up SSE for progress updates if requested
      const acceptsSSE = req.headers.accept && req.headers.accept.includes('text/event-stream');
      
      if (acceptsSSE) {
        // Set up Server-Sent Events
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
        
        // Register progress callback
        const reportId = `rpt_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
        
        this.orchestrator.registerProgressCallback(reportId, (progress) => {
          res.write(`data: ${JSON.stringify(progress)}\n\n`);
        });
        
        // Generate report asynchronously
        this.orchestrator.generateReport(jobId, {
          eolYearBasis,
          customerName: actualCustomerName,
          includeCharts: true,
          includeRecommendations: true
        }).then(result => {
          res.write(`data: ${JSON.stringify({
            type: 'complete',
            reportId: result.reportId,
            filename: result.filename
          })}\n\n`);
          res.end();
        }).catch(error => {
          res.write(`data: ${JSON.stringify({
            type: 'error',
            error: error.message
          })}\n\n`);
          res.end();
        }).finally(() => {
          this.orchestrator.unregisterProgressCallback(reportId);
        });
        
      } else {
        // Regular request - generate and return
        const result = await this.orchestrator.generateReport(jobId, {
          eolYearBasis,
          customerName: actualCustomerName,
          includeCharts: true,
          includeRecommendations: true
        });
        
        res.json({
          success: true,
          reportId: result.reportId,
          statistics: result.statistics,
          filename: result.filename,
          message: 'Report generated successfully'
        });
      }
      
    } catch (error) {
      console.error('Report generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate report',
        details: error.message
      });
    }
  },
  
  /**
   * Export comprehensive lifecycle report to Excel
   */
  async exportLifecycleReportExcel(req, res) {
    const { jobId, eolYearBasis = 'lastDayOfSupport', customerName, reportId } = req.body;
    
    try {
      // If reportId provided, retrieve existing report
      if (reportId) {
        const reportQuery = await db.query(
          'SELECT * FROM lifecycle_reports WHERE report_id = $1 AND status = $2',
          [reportId, 'completed']
        );
        
        if (reportQuery.rows.length > 0) {
          // Retrieve cached report if available
          // In production, this would retrieve from cloud storage
          return res.status(200).json({
            success: true,
            message: 'Report already generated',
            reportId,
            cached: true
          });
        }
      }
      
      // Generate new report
      const result = await this.orchestrator.generateReport(jobId, {
        eolYearBasis,
        customerName: customerName || 'Organization',
        includeCharts: true,
        includeRecommendations: true
      });
      
      // Send Excel file
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.send(result.buffer);
      
    } catch (error) {
      console.error('Excel export error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to export Excel',
        details: error.message
      });
    }
  },
  
  /**
   * Get report generation progress
   */
  async getReportProgress(req, res) {
    const { reportId } = req.params;
    
    try {
      const query = await db.query(
        `SELECT 
          report_id,
          status,
          progress_percentage,
          current_step,
          error_message,
          created_at,
          completed_at
        FROM lifecycle_reports 
        WHERE report_id = $1`,
        [reportId]
      );
      
      if (query.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Report not found'
        });
      }
      
      const report = query.rows[0];
      
      res.json({
        success: true,
        report: {
          reportId: report.report_id,
          status: report.status,
          progress: report.progress_percentage,
          currentStep: report.current_step,
          error: report.error_message,
          createdAt: report.created_at,
          completedAt: report.completed_at
        }
      });
      
    } catch (error) {
      console.error('Progress check error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check progress',
        details: error.message
      });
    }
  },
  
  /**
   * Download completed report
   */
  async downloadReport(req, res) {
    const { reportId } = req.params;
    
    try {
      // Check if report is completed
      const query = await db.query(
        'SELECT * FROM lifecycle_reports WHERE report_id = $1 AND status = $2',
        [reportId, 'completed']
      );
      
      if (query.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Report not found or not completed'
        });
      }
      
      const report = query.rows[0];
      
      // Regenerate the report (in production, this would retrieve from storage)
      const result = await this.orchestrator.generateReport(report.job_id, {
        eolYearBasis: report.eol_year_basis,
        customerName: report.customer_name,
        includeCharts: true,
        includeRecommendations: true
      });
      
      // Send Excel file
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.send(result.buffer);
      
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to download report',
        details: error.message
      });
    }
  },
  
  /**
   * List generated reports
   */
  async listReports(req, res) {
    const { jobId } = req.query;
    
    try {
      let query = `
        SELECT 
          report_id,
          job_id,
          customer_name,
          eol_year_basis,
          status,
          progress_percentage,
          total_products,
          total_quantity,
          critical_risk_count,
          created_at,
          completed_at
        FROM lifecycle_reports
      `;
      
      const params = [];
      
      if (jobId) {
        query += ' WHERE job_id = $1';
        params.push(jobId);
      }
      
      query += ' ORDER BY created_at DESC LIMIT 20';
      
      const result = await db.query(query, params);
      
      res.json({
        success: true,
        reports: result.rows.map(r => ({
          reportId: r.report_id,
          jobId: r.job_id,
          customerName: r.customer_name,
          eolBasis: r.eol_year_basis,
          status: r.status,
          progress: r.progress_percentage,
          statistics: {
            totalProducts: r.total_products,
            totalQuantity: r.total_quantity,
            criticalRiskCount: r.critical_risk_count
          },
          createdAt: r.created_at,
          completedAt: r.completed_at
        }))
      });
      
    } catch (error) {
      console.error('List reports error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to list reports',
        details: error.message
      });
    }
  }
};

module.exports = lifecycleReportController;