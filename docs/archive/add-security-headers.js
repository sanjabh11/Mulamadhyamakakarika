const fs = require('fs');
const path = require('path');

// CSP header to add to all HTML files
const cspHeader = `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://storage.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.fal.ai https://cdn.jsdelivr.net; frame-src 'self';">`;

// Additional security headers
const additionalHeaders = `
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">`;

// Process all HTML files in the public directory
function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively process subdirectories
      processDirectory(filePath);
    } else if (file.endsWith('.html')) {
      // Process HTML files
      addSecurityHeaders(filePath);
    }
  });
}

// Add security headers to an HTML file
function addSecurityHeaders(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if CSP is already present
    if (content.includes('Content-Security-Policy')) {
      console.log(`CSP already exists in ${filePath}`);
      return;
    }

    // Add CSP and other security headers after the viewport meta tag
    if (content.includes('<meta name="viewport"')) {
      content = content.replace(
        /<meta name="viewport"[^>]*>/,
        match => `${match}\n    ${cspHeader}${additionalHeaders}`
      );
    } else if (content.includes('<head>')) {
      // If no viewport meta, add after head tag
      content = content.replace(
        /<head>/,
        match => `${match}\n    ${cspHeader}${additionalHeaders}`
      );
    } else {
      console.log(`Could not find insertion point in ${filePath}`);
      return;
    }

    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Added security headers to ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Start processing from the public directory
console.log('Adding security headers to HTML files...');
processDirectory('public');
console.log('Done!');
