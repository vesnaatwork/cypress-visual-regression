const fs = require('fs');
const path = require('path');

// Define the directories
const mainDirectory = 'cypress/screenshots';
const subdirectories = ['base', 'compare', 'diff'];

// Create main directory
if (!fs.existsSync(mainDirectory)) {
    fs.mkdirSync(mainDirectory);
}

// Create subdirectories
subdirectories.forEach(subdirectory => {
    const subdirectoryPath = path.join(mainDirectory, subdirectory);
    if (!fs.existsSync(subdirectoryPath)) {
        fs.mkdirSync(subdirectoryPath);
    }
});

console.log('Directories created successfully.');