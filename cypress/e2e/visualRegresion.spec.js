const { scenarios, breakpoints, pages } = require('../config'); // Load from config.js

describe('Visual Regression Testing', () => {
  
  pages.forEach((page) => {
    describe(`Testing ${page} page`, () => {
      beforeEach(() => {
        cy.visit(page); // Visit the current page slug
      });

      scenarios.forEach(({ cookiesAccepted, description }) => {
        breakpoints.forEach(({ name, width }) => {
          it(`should verify visual appearance on ${page} ${description} at ${width}px`, () => {
            cy.viewport(width, 1440);

            if (cookiesAccepted) {
              cy.get('.CookieButton.CookieButton-primary')
                .should('be.visible')
                .click();
            } else {
              cy.get('.CookieButton.CookieButton-primary').should('be.visible');
            }
            cy.wait(1000); // Adjust as necessary

            // Optional: Scroll to the bottom if necessary to ensure full visibility
            cy.scrollTo('bottom');

            // Optional: Wait for any additional content to load after scrolling
            cy.wait(1000); // Adjust as necessary

            const fileName = `${page.replace(/\//g, '-')}-${description}-${name}`;
            const folder = Cypress.env('isBaseline') ? 'cypress/screenshots/base' : 'cypress/screenshots/compare';
            if (Cypress.env('isBaseline')) {
              cy.captureScreenshot(fileName, 'cypress/screenshots/base');
            } else {
              cy.captureScreenshot(fileName, 'cypress/screenshots/compare');
              cy.compareScreenshots(fileName, { isBaseline });
            }
          });
        });
      });
    });
  });
   // Add the after hook to clean up the screenshots folder after the tests finish
   //for now this isn't working, there is some issue with the path
  //  after(() => {
  //   cy.task('deleteScreenshotsFolders');
  // });
});
