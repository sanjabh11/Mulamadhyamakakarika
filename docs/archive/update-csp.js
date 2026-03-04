const fs = require('fs');
const path = require('path');

// New CSP content
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
      updateCSP(filePath);
    }
  });
}

// Update CSP in an HTML file
function updateCSP(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if CSP is present
    if (content.includes('Content-Security-Policy')) {
      // Update the CSP
      content = content.replace(
        /<meta http-equiv="Content-Security-Policy" content="[^"]*">/,
        `<meta http-equiv="Content-Security-Policy" content="${newCSP}">`
      );
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated CSP in ${filePath}`);
    } else {
      console.log(`No CSP found in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Start processing from the public directory
console.log('Updating CSP in HTML files...');
processDirectory('public');
console.log('Done!');
