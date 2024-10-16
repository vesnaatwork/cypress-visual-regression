const fs = require('fs-extra');
const path = require('path');

module.exports = (on, config) => {
  on('task', {
    readScreenshotFile({ filePath }) {
      const resolvedPath = path.resolve(filePath);
      if (fs.existsSync(resolvedPath)) {
        return fs.readFileSync(resolvedPath, 'base64');
      }
      throw new Error(`File not found: ${resolvedPath}`);
    },
    writeScreenshotFile({ filePath, content }) {
      fs.ensureDirSync(path.dirname(filePath));
      fs.writeFileSync(path.resolve(filePath), content, 'base64');
      return null;
    },
    log(message) {
      console.log(message);
      return null;
    },
    deleteScreenshotsFolders() {
      // Ensure paths are built relative to the project root
       // Manually set the project path. Adjust this if necessary.
       const projectRoot = path.join(__dirname, '..', '..', 'projects', 'cypress-visual-regression');
     
      const foldersToDelete = [
        path.join(projectRoot, 'cypress', 'screenshots', 'compare'),
        path.join(projectRoot, 'cypress', 'screenshots', 'visualRegresion.spec.js')
      ];

      // Log the paths for debugging
      foldersToDelete.forEach(folder => {
        console.log(`Checking if folder exists: ${folder}`);

        if (fs.existsSync(folder)) {
          console.log(`Deleting folder: ${folder}`);
          fs.removeSync(folder);  // fs-extra's method for recursive folder deletion
        } else {
          console.log(`Folder not found: ${folder}`);
        }
      });

      return null; // Return null to signify task completion
    }
  });

  return config;
};