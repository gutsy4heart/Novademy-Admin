const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Clean up node_modules/.cache
console.log('Cleaning up React cache...');
const cachePath = path.join(__dirname, 'node_modules', '.cache');
if (fs.existsSync(cachePath)) {
  try {
    fs.rmdirSync(cachePath, { recursive: true });
    console.log('Cache directory removed successfully');
  } catch (err) {
    console.error('Error removing cache directory:', err);
  }
}

// Start the development server
console.log('Starting development server...');
exec('npm start', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
}); 