import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, TrendingUp, Shield, Lightbulb, Menu, X, Download } from 'lucide-react';

/**
 * DESIGN SYSTEM GUIDE
 * ===================
 * 
 * BRAND & TOKENS
 * --------------
 * Company: Positive Impact Technology
 * Tagline: Technology That Elevates Purpose
 * Mission: Deliver simple, reliable, and affordable technology solutions
 * 
 * COLORS
 * ------
 * Primary Navy: #002D62 (headers, primary text, emphasis)
 * Accent Teal: #008080 (CTAs, active states, success indicators)
 * Background Off-White: #F8F8F8 (page background)
 * White: #FFFFFF (cards, input backgrounds)
 * 
 * TYPOGRAPHY
 * ----------
 * Font Stack: Proxima Nova, Inter, system-ui
 * Headings: Bold UPPERCASE
 * Body: Regular sentence case
 * Accents: Light italic for quotes/emphasis
 * 
 * PERSONALITY
 * -----------
 * Trusted, approachable, human-centered, practical innovation, purpose-driven
 * Classic, trustworthy, minimal with strong navy/teal contrast
 * 
 * LAYOUT
 * ------
 * Auto-sizing layout: Input section fits content, Results section takes remaining space
 * Responsive breakpoints: 1280px desktop → 375px mobile
 * Grid system: Tailwind utilities with consistent padding and margins
 * Equal margins throughout for visual balance
 */

const LifecyclePage = () => {
  // State management for interactive elements
  const [activePhase, setActivePhase] = useState(null);
  const [completedPhases, setCompletedPhases] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    customerName: ''
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Example data for results section
  const exampleSummary = {
    opportunities: [
      "Consolidate vendors to reduce OpEx by 12%",
      "Automate reporting to cut manual effort by 40%",
    ],
    risks: [
      "Data quality variance in initial import",
      "Under-resourced change management",
    ],
    findings: [
      "Phase 1 highlights quick-win automation candidates",
      "Phase 2 requires stakeholder training plan",
    ],
  };

  const phases = [
    { id: 1, name: 'Phase 1', icon: FileText },
    { id: 2, name: 'Phase 2', icon: TrendingUp },
    { id: 3, name: 'Phase 3', icon: CheckCircle },
    { id: 4, name: 'Export', icon: Download }
  ];

  // File handling functions
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      setUploadedFile(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handlePhaseClick = (phaseId) => {
    if (phaseId === 4) {
      // Export functionality - available when any phase is complete
      if (completedPhases.length > 0) {
        alert('Export functionality - download analysis results');
      }
      return;
    }

    // Check if we can run this phase based on new logic
    if (phaseId === 1) {
      // Phase 1 requires only file upload (customer name is optional for now)
      if (!uploadedFile) {
        alert('Please upload a file first');
        return;
      }
    } else if (phaseId === 2) {
      // Phase 2 requires Phase 1 to be completed
      if (!completedPhases.includes(1)) {
        alert('Please complete Phase 1 first');
        return;
      }
    } else if (phaseId === 3) {
      // Phase 3 requires Phase 1 OR Phase 2 to be completed
      if (!completedPhases.includes(1) && !completedPhases.includes(2)) {
        alert('Please complete Phase 1 or Phase 2 first');
        return;
      }
    }

    // Run the phase if not completed yet
    if (!completedPhases.includes(phaseId)) {
      // Simulate running the phase
      setTimeout(() => {
        setCompletedPhases(prev => [...prev, phaseId]);
        setActivePhase(phaseId);
      }, 500);
    } else {
      // Just switch to view the phase results
      setActivePhase(phaseId);
    }
  };

  const handleReset = () => {
    setActivePhase(null);
    setCompletedPhases([]);
    setUploadedFile(null);
    setFormData({ customerName: '' });
    setMobileMenuOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" style={{ backgroundColor: '#F8F8F8' }}>
      {/* Header - Sticky Navigation */}
      <header className="sticky top-0 z-50 shadow-md" style={{ backgroundColor: '#002D62' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-white font-bold text-xl uppercase tracking-wide">
                Life Cycle Analysis
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/lifecycle" className="text-white hover:text-gray-200 transition-colors border-b-2" style={{ borderColor: '#008080' }}>
                Lifecycle
              </a>
              <a href="/docs" className="text-white hover:text-gray-200 transition-colors border-b-2 border-transparent hover:border-gray-400">
                Docs
              </a>
              <a href="/support" className="text-white hover:text-gray-200 transition-colors border-b-2 border-transparent hover:border-gray-400">
                Support
              </a>
              <a href="/pricing" className="text-white hover:text-gray-200 transition-colors border-b-2 border-transparent hover:border-gray-400">
                Pricing
              </a>
            </nav>

            {/* CTAs */}
            <div className="hidden md:flex items-center space-x-4">
              {completedPhases.length > 0 && (
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors text-sm"
                  aria-label="Reset analysis"
                >
                  Reset
                </button>
              )}
              <button 
                className="px-4 py-2 border-2 text-white hover:bg-white hover:bg-opacity-10 transition-all transform hover:scale-105"
                style={{ borderColor: '#008080' }}
              >
                Contact
              </button>
              <button 
                className="px-4 py-2 text-white transition-all transform hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: '#008080' }}
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/lifecycle" className="block px-3 py-2 text-white hover:bg-gray-700 rounded">Lifecycle</a>
              <a href="/docs" className="block px-3 py-2 text-white hover:bg-gray-700 rounded">Docs</a>
              <a href="/support" className="block px-3 py-2 text-white hover:bg-gray-700 rounded">Support</a>
              <a href="/pricing" className="block px-3 py-2 text-white hover:bg-gray-700 rounded">Pricing</a>
              <div className="border-t border-gray-700 mt-2 pt-2">
                <button 
                  onClick={handleReset}
                  className="block w-full text-left px-3 py-2 text-red-400 hover:bg-gray-700 rounded"
                >
                  Reset Analysis
                </button>
              </div>
              <div className="flex space-x-2 px-3 py-2">
                <button className="flex-1 px-4 py-2 border-2 text-white" style={{ borderColor: '#008080' }}>
                  Contact
                </button>
                <button className="flex-1 px-4 py-2 text-white" style={{ backgroundColor: '#008080' }}>
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content - Auto-sizing Layout for better fit */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div 
          className="grid grid-rows-1 lg:grid-rows-[auto_1fr] gap-4 min-h-[calc(100vh-9rem)]"
        >
          {/* Input Section - Compact */}
          <section className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              {/* Modernized File Upload Area */}
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase mb-2" style={{ color: '#002D62' }}>
                  Data File *
                </label>
                <div 
                  className={`relative border rounded-lg transition-all cursor-pointer group ${
                    isDragging ? 'border-2 shadow-lg' : 'border'
                  } ${uploadedFile ? 'bg-teal-50 border-teal-500' : 'bg-white hover:bg-gray-50'}`}
                  style={{ 
                    borderColor: isDragging ? '#008080' : uploadedFile ? '#008080' : '#e5e7eb'
                  }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  aria-label="File upload - click or drag to upload CSV or XLSX file"
                >
                  <div className="flex items-center px-4 py-3">
                    <div className="flex-shrink-0">
                      {uploadedFile ? (
                        <CheckCircle size={20} style={{ color: '#008080' }} />
                      ) : (
                        <Upload size={20} className="text-gray-400 group-hover:text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 ml-3">
                      <p className="text-sm font-medium" style={{ color: uploadedFile ? '#008080' : '#002D62' }}>
                        {uploadedFile ? uploadedFile.name : 'Choose file or drag here'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {uploadedFile ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : 'CSV or XLSX up to 10MB'}
                      </p>
                    </div>
                    {uploadedFile && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                        }}
                        className="flex-shrink-0 ml-2 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove file"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={handleFileSelect}
                    className="hidden"
                    aria-label="File input"
                  />
                </div>
              </div>

              {/* Customer Name and Status Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Name Input */}
                <div>
                  <label htmlFor="customerName" className="block text-xs font-bold uppercase mb-2" style={{ color: '#002D62' }}>
                    Customer Name *
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Enter customer organization name"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                    required
                    aria-required="true"
                  />
                  {uploadedFile && completedPhases.length === 0 && (
                    <p className="text-xs text-teal-600 mt-1" role="status">
                      Ready! Click Phase 1 below to start analysis
                    </p>
                  )}
                </div>

                {/* Analysis Summary Status */}
                <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      completedPhases.length > 0 ? 'bg-green-100 text-green-700' : 
                      uploadedFile ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {completedPhases.length > 0 ? 'Processing' : uploadedFile ? 'Ready' : 'Waiting'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xs text-gray-500">File Status</p>
                      <p className="text-sm font-semibold" style={{ color: uploadedFile ? '#008080' : '#999' }}>
                        {uploadedFile ? '✓ Loaded' : '— Empty'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Data Rows</p>
                      <p className="text-sm font-semibold" style={{ color: uploadedFile ? '#002D62' : '#999' }}>
                        {uploadedFile ? '1,247' : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phases Done</p>
                      <p className="text-sm font-semibold" style={{ color: completedPhases.length > 0 ? '#002D62' : '#999' }}>
                        {completedPhases.length > 0 ? `${completedPhases.length}/3` : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Results Section - Flexible Height */}
          <section className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-bold uppercase mb-4" style={{ color: '#002D62' }}>
                Analysis
              </h2>

              {/* Phase Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
              {phases.map((phase) => {
                const Icon = phase.icon;
                const isActive = phase.id === activePhase;
                const isCompleted = completedPhases.includes(phase.id);
                const canRun = uploadedFile && formData.customerName && 
                               (phase.id === 1 || completedPhases.includes(phase.id - 1));
                const isExport = phase.id === 4;
                
                return (
                  <button
                    key={phase.id}
                    onClick={() => handlePhaseClick(phase.id)}
                    className={`flex items-center px-4 py-2 rounded-full transition-all ${
                      isExport 
                        ? completedPhases.length === 3
                          ? 'text-white hover:opacity-90 shadow-md' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                        : isActive 
                          ? 'text-white shadow-md transform scale-105' 
                          : isCompleted
                            ? 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                            : canRun
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md font-medium'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                    }`}
                    style={{ 
                      backgroundColor: isExport 
                        ? completedPhases.length === 3 ? '#002D62' : undefined 
                        : isActive ? '#008080' : undefined,
                      color: (isExport && completedPhases.length === 3) || isActive ? 'white' : undefined
                    }}
                    disabled={isExport ? completedPhases.length !== 3 : (!uploadedFile || !formData.customerName || (phase.id > 1 && !completedPhases.includes(phase.id - 1)))}
                    aria-pressed={isActive && !isExport ? 'true' : undefined}
                    aria-label={`${phase.name} ${
                      isActive && !isExport ? '(active)' : 
                      isCompleted ? '(completed)' : 
                      canRun && !isExport ? '(ready to run)' : 
                      isExport && completedPhases.length === 3 ? '(ready)' : 
                      ''
                    }`}
                    title={
                      isExport && completedPhases.length !== 3
                        ? 'Complete all phases before exporting'
                        : !canRun && !isExport 
                          ? phase.id === 1 
                            ? 'Upload file and enter customer name first' 
                            : `Complete Phase ${phase.id - 1} first`
                          : undefined
                    }
                  >
                    <Icon size={16} className="mr-2" />
                    {phase.name}
                    {isCompleted && !isExport && !isActive && (
                      <CheckCircle size={14} className="ml-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {activePhase && completedPhases.includes(activePhase) ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Opportunities Card */}
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <Lightbulb size={24} style={{ color: '#008080' }} />
                      <h3 className="ml-2 font-bold uppercase" style={{ color: '#002D62' }}>
                        Opportunities
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {exampleSummary.opportunities.map((item, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="mr-2" style={{ color: '#008080' }}>•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risks Card */}
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <AlertCircle size={24} style={{ color: '#008080' }} />
                      <h3 className="ml-2 font-bold uppercase" style={{ color: '#002D62' }}>
                        Risks
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {exampleSummary.risks.map((item, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="mr-2" style={{ color: '#008080' }}>•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Findings Card */}
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <Shield size={24} style={{ color: '#008080' }} />
                      <h3 className="ml-2 font-bold uppercase" style={{ color: '#002D62' }}>
                        Key Findings
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {exampleSummary.findings.map((item, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="mr-2" style={{ color: '#008080' }}>•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50"
                  aria-label="Visualization area - charts will appear here after analysis"
                >
                  <div className="text-center">
                    <TrendingUp size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">
                      {activePhase === 4 ? 'Export Ready' : `Phase ${activePhase} Analytics Visualization`}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {activePhase === 4 ? 'Click Export to download results' : 'Interactive charts will render here'}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-center">
                  <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">No analysis results yet</p>
                  <p className="text-sm text-gray-500">
                    {!uploadedFile 
                      ? 'Upload a file to begin'
                      : 'Click a Phase button above to run analysis'}
                  </p>
                </div>
              </div>
            )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-4" style={{ backgroundColor: '#002D62' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-white text-xs">
            <span className="mb-2 sm:mb-0">© Positive Impact Technology™</span>
            <nav className="flex items-center space-x-2">
              <a href="/privacy" className="hover:text-gray-300 transition-colors text-sm">Privacy</a>
              <span className="text-gray-400">|</span>
              <a href="/about" className="hover:text-gray-300 transition-colors text-sm">About</a>
              <span className="text-gray-400">|</span>
              <a href="/support" className="hover:text-gray-300 transition-colors text-sm">Support</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LifecyclePage;