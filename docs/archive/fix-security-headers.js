const fs = require('fs');
const path = require('path');

// New CSP content that includes cdn.jsdelivr.net
const newCSP = `default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://storage.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.fal.ai https://cdn.jsdelivr.net; frame-src 'self';`;

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
      fixHeaders(filePath);
    }
  });
}

// Fix headers in an HTML file
function fixHeaders(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 1. Update CSP to include cdn.jsdelivr.net
    if (content.includes('Content-Security-Policy')) {
      content = content.replace(
        /<meta http-equiv="Content-Security-Policy" content="[^"]*">/,
        `<meta http-equiv="Content-Security-Policy" content="${newCSP}">`
      );
      modified = true;
    }
    
    // 2. Remove X-Frame-Options meta tag (it should only be set via HTTP headers)
    if (content.includes('X-Frame-Options')) {
      content = content.replace(
        /<meta http-equiv="X-Frame-Options"[^>]*>/,
        ''
      );
      modified = true;
    }
    
    // 3. Remove Referrer-Policy meta tag (also better as HTTP header)
    if (content.includes('Referrer-Policy')) {
      content = content.replace(
        /<meta http-equiv="Referrer-Policy"[^>]*>/,
        ''
      );
      modified = true;
    }
    
    // Write the updated content back to the file if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed headers in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Start processing from the public directory
console.log('Fixing security headers in HTML files...');
processDirectory('public');
console.log('Done!');
