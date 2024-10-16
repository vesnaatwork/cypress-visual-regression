const { defineConfig } = require('cypress');
const fs = require('fs-extra');
const path = require('path');
const dotenv = require('dotenv');

// Load variables from .env
dotenv.config();

module.exports = defineConfig({
  e2e: {
    screenshotsFolder: 'cypress/screenshots',
    trashAssetsBeforeRuns: false, 
    setupNodeEvents(on, config) {
      const cypressCap = config.env.CYPRESS_CAP || process.env.CYPRESS_CAP;

      // Log both to check
      console.log(`CYPRESS_CAP value: ${cypressCap}`);

      // Set isBaseline
      config.env.isBaseline = cypressCap === 'true';

      console.log(`isBaseline value: ${config.env.isBaseline}`);
      
      on('task', {
        // Clean up comparison screenshots only, not the baseline ones
        cleanComparisonScreenshots() {
          const comparePath = path.resolve('cypress/screenshots/compare');
          if (fs.existsSync(comparePath)) {
            fs.emptyDirSync(comparePath); // Only clear out comparison folder
          }
          return true;  // Return true instead of null
        },

        // Read a screenshot file
        readScreenshotFile({ filePath }) {
          const resolvedPath = path.resolve(filePath);
          console.log(`Reading screenshot from: ${resolvedPath}`); // Add this line
          if (fs.existsSync(resolvedPath)) {
            return fs.readFileSync(resolvedPath, 'base64');
          }
          throw new Error(`File not found: ${resolvedPath}`);
        },
        
        // Write the screenshot file
        writeScreenshotFile({ filePath, content }) {
          console.log(`Writing screenshot from: ${filePath}`); // Add this line
          fs.ensureDirSync(path.dirname(filePath));
          fs.writeFileSync(path.resolve(filePath), content, 'base64');
          return true;  // Return true instead of null
        },

        // Clean up specific file
        cleanUp({ filePath }) {
          const resolvedPath = path.resolve(filePath);
          if (fs.existsSync(resolvedPath)) {
            fs.unlinkSync(resolvedPath);
          }
          return true;  // Return true instead of null
        },

        // Delete screenshots folders
        deleteScreenshotsFolders() {
          const foldersToDelete = [
            path.join(__dirname, '..', '..', 'cypress', 'screenshots', 'compare'),
            path.join(__dirname, '..', '..', 'cypress', 'screenshots', 'visualRegresion.spec.js')
          ];
      
          foldersToDelete.forEach(folder => {
            console.log(`Checking if folder exists: ${folder}`);
            
            if (fs.existsSync(folder)) {
              console.log(`Deleting folder: ${folder}`);
              fs.rmdirSync(folder, { recursive: true });  // Delete folder and contents
            } else {
              console.log(`Folder not found: ${folder}`);
            }
          });
      
          return null; // Return null to signify task completion
        },
      });

     // Log the environment being used
     const environment = config.env.environment || 'dev';
     console.log(`Using environment: ${environment}`);

     const urls = {
       dev: config.env.devUrl,
       prod: config.env.prodUrl,
     };

     config.baseUrl = urls[environment];
     console.log(`Base URL set to: ${config.baseUrl}`); // Log the base URL being used


      return config;
    },
    env: {
      devUrl: 'http://workco-2020-dev.s3-website-us-east-1.amazonaws.com/',
      prodUrl: 'http://work.co',
    },
    specPattern: 'cypress/e2e/**/*.{js,ts}',
  },
});
