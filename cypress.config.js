const { defineConfig } = require('cypress');
const fs = require('fs-extra');
const path = require('path');

module.exports = defineConfig({
  e2e: {
    screenshotsFolder: 'cypress/screenshots',
    trashAssetsBeforeRuns: false, // Prevent automatic deletion of screenshots before each run
    setupNodeEvents(on, config) {
      // Your existing setup code
      on('task', {
        // Add a task to clean up comparison screenshots only, not the baseline ones
        cleanComparisonScreenshots() {
          const comparePath = path.resolve('cypress/screenshots/compare');
          if (fs.existsSync(comparePath)) {
            fs.emptyDirSync(comparePath); // Only clear out comparison folder, not baseline
          }
          return null;
        },
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
        cleanUp({ filePath }) {
          const resolvedPath = path.resolve(filePath);
          if (fs.existsSync(resolvedPath)) {
            fs.unlinkSync(resolvedPath);
          }
          return null;
        },
        deleteScreenshotsFolders() {
          const foldersToDelete = [
            path.join(__dirname, '..', '..', 'cypress', 'screenshots', 'compare'),
            path.join(__dirname, '..', '..', 'cypress', 'screenshots', 'visualRegresion.spec.js')
          ];
    
          foldersToDelete.forEach(folder => {
            if (fs.existsSync(folder)) {
              fs.rmdirSync(folder, { recursive: true });  // Delete folder and contents
            }
          });
    
          return null;
        },
      });
      

      const environment = config.env.environment || 'dev'; // Default to 'dev'

      // Define base URLs for environments
      const urls = {
        dev: config.env.devUrl,
        prod: config.env.prodUrl,
      };

      config.baseUrl = urls[environment];
      return config;
    },
    env: {
      devUrl: 'http://workco-2020-dev.s3-website-us-east-1.amazonaws.com/',
      prodUrl: 'http://work.co',
      baseline: process.env.CYPRESS_CAP === 'true', // Ensure correct boolean conversion from string
    },
    specPattern: 'cypress/e2e/**/*.{js,ts}',
  },
});