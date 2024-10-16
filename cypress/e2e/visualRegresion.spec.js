const { scenarios, breakpoints, pages, isBaseline } = require('../config'); // Load from config.js

describe('Visual Regression Testing', () => {
  
  pages.forEach((page) => {
    describe(`Testing ${page} page`, () => {
      beforeEach(() => {
        cy.visit(page); // Visit the current page slug
      });

      scenarios.forEach(({ cookiesAccepted, description }) => {
        breakpoints.forEach(({ name, width }) => {
          it(`should verify visual appearance on ${page} ${description} at ${width}px`, () => {
            cy.viewport(width, 800);

            if (cookiesAccepted) {
              cy.get('.CookieButton.CookieButton-primary')
                .should('be.visible')
                .click();
            } else {
              cy.get('.CookieButton.CookieButton-primary').should('be.visible');
            }

            const fileName = `${page.replace(/\//g, '-')}-${description}-${name}`;
            const folder = isBaseline ? 'cypress/screenshots/base' : 'cypress/screenshots/compare';

            cy.captureScreenshot(fileName, folder);
            if (!isBaseline) {
              cy.compareScreenshots(fileName, { isBaseline });
            }
          });
        });
      });
    });
  });
   // Add the after hook to clean up the screenshots folder after the tests finish
   after(() => {
    cy.task('deleteScreenshotsFolders');
  });
});
