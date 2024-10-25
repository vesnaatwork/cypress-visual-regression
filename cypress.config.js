const { defineConfig } = require('cypress');
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

module.exports = defineConfig({
  e2e: {
    screenshotsFolder: 'cypress/screenshots',
    trashAssetsBeforeRuns: false, 
    browser: 'chrome',
    setupNodeEvents(on, config) {

      // const cypressCap = process.env.isBaseline;

      // // Log both to check
      // console.log(`CYPRESS_CAP value: ${cypressCap}`);
      
      on('task', {
        // Clean up comparison screenshots only, not the baseline ones
        cleanComparisonScreenshots() {
          const comparePath = path.resolve('cypress/screenshots/compare');
          if (fs.existsSync(comparePath)) {
            fs.emptyDirSync(comparePath); // Only clear out comparison folder
          }
          return true;  // Return true instead of null
        },

        writeScreenshotFile({ filePath, content }) {
          console.log(`Writing screenshot from: ${filePath}`); // Add this line
          fs.ensureDirSync(path.dirname(filePath));
          const contentSizeKb = Buffer.byteLength(content, 'base64') / 1024;
          console.log(`Writing screenshot from: ${filePath}`); 
          console.log(`Screenshot content size: ${contentSizeKb.toFixed(2)} KB`); // Log content size
        
          fs.writeFileSync(path.resolve(filePath), content, 'base64');
          return true;  // Return true instead of null
        },
        readScreenshotFile({ filePath }) {
          return fs.readFileSync(filePath, 'base64');
        },
        cropScreenshot({ sourcePath, targetPath }) {
          return new Promise((resolve, reject) => {
            sharp(sourcePath)
              .trim()  // Automatically remove black borders
              .toFile(targetPath, (err, info) => {
                if (err) {
                  reject(`Error during screenshot cropping: ${err.message}`);
                } else {
                  resolve(`Cropped screenshot saved at: ${targetPath}`);
                }
              });
          });
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
      on('before:browser:launch', (browser, launchOptions) => {
        const viewportWidth = process.env.VIEWPORT_WIDTH || 2560; // Default width
        const viewportHeight = process.env.VIEWPORT_HEIGHT || 1920; // Default height

        // fullPage screenshot size is 1400x1200 on non-retina screens
        // and 2800x2400 on retina screens
        launchOptions.args.push(`--window-size=${viewportWidth},${viewportHeight}`)
        // force screen to be non-retina (1400x1200 size)
        launchOptions.args.push('--force-device-scale-factor=1')
        return launchOptions
      })

     const environment = config.env.environment || 'dev';
     console.log(`Using environment: ${environment}`);
     config.isBaseline = String(config.env.isBaseline) === 'true';
     console.log(`is baseline ${config.env.isBaseline}`)

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
