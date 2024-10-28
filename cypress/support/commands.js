import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';


Cypress.Commands.add('pauseAndBlackOutVideos', () => {
    cy.get('#player .vp-telecine video', { timeout: 10000 }).then(($video) => { // Adjust the selector as necessary
      if ($video.length > 0) {
        // Pause video and hide it with a black overlay
        $video.get(0).pause();
        const { width, height } = $video.get(0).getBoundingClientRect();
        cy.wrap($video).css('display', 'none');
        cy.wrap($video).parent().append(`<div style="background-color:black; width:${width}px; height:${height}px; position:absolute;z-index:10;"></div>`);
      } else {
        cy.log('Video element not found.');
      }
    });
  });

  
  Cypress.Commands.add('captureScreenshot', (fileName, targetFolder = 'screenshots', desiredWidth = 800, desiredHeight = 600) => {
    // Apply CSS transform to zoom out the page
    cy.document().then((doc) => {
      const style = doc.createElement('style');
      style.innerHTML = 'body { transform: scale(0.5); transform-origin: 0 0; }'; // Adjust scale as needed
      doc.head.appendChild(style);
      style.setAttribute('id', 'custom-zoom-style'); // Add an identifier to the style element for easy removal
    });
  
    cy.screenshot(fileName, { capture: 'fullPage' }).then(() => {
      const specFileName = Cypress.spec.name.split('/').pop(); // Extract the spec filename
      const sourcePath = `cypress/screenshots/${specFileName}/${fileName}.png`;  // Correct path
      const customTargetPath = `${targetFolder}/${fileName}.png`;
  
      console.log(`Saving screenshot: Source path: ${sourcePath}, Target path: ${customTargetPath}`);
      cy.task('readScreenshotFile', { filePath: sourcePath }).then((fileContent) => {
        // Decode the image content from base64
        const buffer = Buffer.from(fileContent, 'base64');
        const png = PNG.sync.read(buffer);
  
        // Adjust the canvas size using the adjustCanvas function with parameters
        const adjustedPng = adjustCanvas(png, desiredWidth, desiredHeight);
  
        // Encode the adjusted image back to base64
        const adjustedBuffer = PNG.sync.write(adjustedPng);
  
        cy.task('writeScreenshotFile', { filePath: customTargetPath, content: adjustedBuffer.toString('base64') }).then(() => {
          console.log(`Screenshot saved to ${customTargetPath}`);
        });
      });
    }).then(() => {
      // Remove the CSS transform after screenshot is taken
      cy.document().then((doc) => {
        const style = doc.getElementById('custom-zoom-style');
        if (style) {
          style.remove();
        }
      });
    });
  });
  Cypress.Commands.add('captureScreenshotWithoutScaling', (fileName, targetFolder) => {
    // Set viewport size to the desired width/height
    
    // Capture full-page screenshot
    cy.screenshot(fileName, { capture: 'fullPage' }).then(() => {
        const specFileName = Cypress.spec.name.split('/').pop();
        const sourcePath = `cypress/screenshots/${specFileName}/${fileName}.png`;
        const targetPath = `${targetFolder}/${fileName}.png`;

        cy.task('cropScreenshot', { sourcePath, targetPath }).then(() => {
            console.log(`Screenshot saved and cropped: ${targetPath}`);
        });
    });
  });
  Cypress.Commands.add('writeDiffFile', (diff, diffPath) => {
    console.log(`in writeDiffFile ${diff} ${diffPath}`);
    // Write the screenshot file using cy.task and PNG
    if (diff) {
      const content = PNG.sync.write(diff).toString('base64');
      cy.task('writeScreenshotFile', { filePath: diffPath, content });
    }
  });
  // The adjustCanvas function to adjust image dimensions if required
  export const adjustCanvas = (image, width, height) => {
    if (image.width === width && image.height === height) {
      return image;
    }
    const imageAdjustedCanvas = new PNG({ width, height, inputHasAlpha: true });
    PNG.bitblt(image, imageAdjustedCanvas, 0, 0, Math.min(image.width, width), Math.min(image.height, height), 0, 0);
    return imageAdjustedCanvas;
  };
  
  
  
  
  
  Cypress.Commands.add('compareScreenshots', (fileName, { isBaseline }) => {
  if (isBaseline) return;

  const specFileName = Cypress.spec.name.split('/').pop(); // Ensure it reflects `visualRegresion.spec.js`
  const basePath = `cypress/screenshots/base/${fileName}.png`;
  const currentPath = `cypress/screenshots/compare/${fileName}.png`;
  const diffPath = `cypress/screenshots/diff/${fileName}-diff.png`;

  cy.task('readScreenshotFile', { filePath: basePath }).then((baseImageBase64) => {
    cy.task('readScreenshotFile', { filePath: currentPath }).then((currentImageBase64) => {
      const baseBuffer = Buffer.from(baseImageBase64, 'base64');
      const currentBuffer = Buffer.from(currentImageBase64, 'base64');

      const baseImage = PNG.sync.read(baseBuffer);
      const currentImage = PNG.sync.read(currentBuffer);

      const { width, height } = baseImage;
      const diff = new PNG({ width, height });

      const numDiffPixels = pixelmatch(baseImage.data, currentImage.data, diff.data, width, height);


      return cy.wrap({ numDiffPixels, diff, diffPath });
    });
  });
});
