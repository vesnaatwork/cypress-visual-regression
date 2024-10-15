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

  
  Cypress.Commands.add('captureScreenshot', (fileName, targetFolder = 'screenshots') => {
    cy.screenshot(fileName, { capture: 'fullPage' }).then(() => {
      const specFileName = Cypress.spec.name.split('/').pop(); // This will return `visualRegresion.spec.js`
      const sourcePath = `cypress/screenshots/${specFileName}/${fileName}.png`; // Correct temporary path with .js
      const customTargetPath = `${targetFolder}/${fileName}.png`;
  
      cy.task('readScreenshotFile', { filePath: sourcePath }).then((fileContent) => {
        cy.task('writeScreenshotFile', { filePath: customTargetPath, content: fileContent }).then(() => {
          console.log(`Screenshot saved to ${customTargetPath}`);
        });
      });
    });
  });
  
  
  
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

      cy.task('writeScreenshotFile', { filePath: diffPath, content: PNG.sync.write(diff).toString('base64') });
      expect(numDiffPixels).to.be.lessThan(100);
    });
  });
});
