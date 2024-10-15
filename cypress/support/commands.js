import fs from 'fs';

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


Cypress.Commands.add('captureScreenshot', (fileName, targetFolder) => {
  cy.screenshot(fileName, { capture: 'viewport' }).then(() => {
    const sourcePath = `cypress/screenshots/${Cypress.spec.name}/${fileName}.png`;
    const targetPath = `${targetFolder}/${fileName}.png`;

    cy.readFile(sourcePath, 'base64').then((fileContent) => {
      cy.writeFile(targetPath, fileContent, 'base64');
    });
  });
});