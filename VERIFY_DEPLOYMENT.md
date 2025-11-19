# How to Verify Cache Toggle is in Deployment

## Method 1: Check Browser Console

After deployment, open browser console and run:

```javascript
// Check if component exists
window.CacheToggleComponent

// Check if component rendered
window._cacheToggleRendered

// Check current value
window._cacheToggleValue

// Search DOM for the element
document.querySelector('[data-testid="cache-toggle-container"]')
document.querySelector('[data-always-visible="true"]')
document.querySelector('#use-cached-research-checkbox')
```

## Method 2: Check Built JavaScript Bundle

In Cloud Shell, after build completes, you can check what's in the built file:

```bash
# Extract and check the built JS file
docker run --rm gcr.io/lifecycle-analysis-477518/lifecycle-analysis:latest sh -c "grep -o 'Use Cached Research' /usr/share/nginx/html/assets/*.js | head -1"
```

## Method 3: Verify Build Used Latest Commit

Check the build logs to see which commit SHA was used:

```bash
gcloud builds describe <BUILD_ID> --format="yaml" | grep COMMIT_SHA
```

## Method 4: Direct File Check in Cloud Run

The built files are in the nginx container. You can't directly access them, but you can verify by:
1. Checking the network tab in browser DevTools
2. Looking at the loaded JavaScript file
3. Searching for "Use Cached Research" in the source

