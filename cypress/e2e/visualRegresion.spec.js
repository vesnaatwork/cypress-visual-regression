const { scenarios, breakpoints, pages } = require('../config'); // Load from config.js

describe('Visual Regression Testing', () => {

  pages.forEach((page) => {
    describe(`Testing ${page} page`, () => {
      
      beforeEach(() => {
        cy.visit(page); // Visit the current page slug
      });

      scenarios.forEach(({ cookiesAccepted, description }) => {
        breakpoints.forEach(({ name, width,height }) => {
          before(() => {
            process.env.VIEWPORT_WIDTH = width.toString();
            process.env.VIEWPORT_HEIGHT = height.toString();
      
          });
          it(`should verify visual appearance on ${page} ${description} at ${width}px`, () => {
            cy.viewport(width, height);

            if (cookiesAccepted) {
              cy.get('.CookieButton.CookieButton-primary')
                .should('be.visible')
                .click();
            } else {
              cy.get('.CookieButton.CookieButton-primary').should('be.visible');
            }
            cy.wait(1000); // Adjust as necessary

            // Scroll to the bottom if necessary to ensure full content is rendered
            cy.scrollTo('bottom');

            // Optional: Wait for any additional content to load after scrolling
            cy.wait(1000); // Adjust as necessary

            // Calculate the dynamic height
            cy.document().then((doc) => {

              const fileName = `${page.replace(/\//g, '-')}-${description}-${name}`;
              const isBaseline = Cypress.config('isBaseline');

              if (isBaseline===true) {
                // cy.captureScreenshot(fileName, 'cypress/screenshots/base', width, bodyHeight);
                cy.captureScreenshotWithoutScaling(fileName,'cypress/screenshots/base');
              } else 
              if(isBaseline===false) {
                // cy.captureScreenshot(fileName, 'cypress/screenshots/compare', width, bodyHeight);
                cy.captureScreenshotWithoutScaling(fileName,'cypress/screenshots/compare');
                cy.compareScreenshots(fileName, { isBaseline });
              }
            });
          });
        });
      });
    });
  });

  // Add the after hook to clean up the screenshots folder after the tests finish
  // for now this isn't working, there is some issue with the path
  // after(() => {
  //   cy.task('deleteScreenshotsFolders');
  // });
});