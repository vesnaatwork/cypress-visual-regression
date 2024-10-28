const { scenarios, breakpoints, pages } = require('../config'); // Load from config.js

// Event listener for when a test fails
Cypress.on('fail', (error, runnable) => {
  const comparisonResultAlias = cy.state('aliases')?.comparisonResult;
  if (comparisonResultAlias) {
    cy.get('@comparisonResult').then(({ diff, diffPath }) => {
      if (diff && diffPath) {
        const failedDiffPath = diffPath.replace(/\/diff\//, '/diff/failed/');
        cy.writeDiffFile(diff, failedDiffPath);
      }
    });
  }
  throw error; // Re-throw the error to make Cypress fail the test as expected
});

describe('Visual Regression Testing', () => {
  afterEach(() => {
    if (!Cypress.config('isBaseline')) {
      const comparisonResultAlias = cy.state('aliases')?.comparisonResult;
      if (comparisonResultAlias) {
        cy.get('@comparisonResult').then(({ diff, diffPath }) => {
          // Check for both `diff` and `diffPath` before proceeding
          if (diff && diffPath) {
            cy.writeDiffFile(diff, diffPath);
          }
        });
      }
    }
  });

  pages.forEach((page) => {
    describe(`Testing ${page} page`, () => {
      beforeEach(() => {
        cy.visit(page);
      });

      scenarios.forEach(({ cookiesAccepted, description }) => {
        breakpoints.forEach(({ name, width, height }) => {
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
            cy.scrollTo('bottom');
            cy.wait(1000); // Adjust as necessary

            cy.document().then((doc) => {
              const fileName = `${page.replace(/\//g, '-')}-${description}-${name}`;
              const isBaseline = Cypress.config('isBaseline');

              if (isBaseline) {
                cy.captureScreenshotWithoutScaling(fileName, 'cypress/screenshots/base');
              } else {
                cy.captureScreenshotWithoutScaling(fileName, 'cypress/screenshots/compare');
                cy.compareScreenshots(fileName, { isBaseline }).then(({ numDiffPixels, diff, diffPath }) => {
                  cy.wrap({ diff, diffPath, numDiffPixels }).as('comparisonResult');
                }).then(() => {
                  // Perform the assertion
                  cy.get('@comparisonResult').then(({ numDiffPixels }) => {
                    expect(numDiffPixels).to.be.lessThan(100);
                  });
                });
              }
            });
          });
        });
      });
    });
  });
});
