import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
const fs = require('fs');

describe('Visual Regression Testing', () => {
  beforeEach(() => {
    cy.visit('/'); // Dynamically uses the baseUrl set in config
  });
  const scenarios = [
    { cookiesAccepted: false, description: 'without-cookies' },
    { cookiesAccepted: true, description: 'with-cookies' }
  ];

  const breakpoints = [
    { name: 'S', width: 375 },
    { name: 'M', width: 768 },
    { name: 'L', width: 1024 },
    { name: 'XL', width: 1440 },
    { name: 'XXL', width: 2560 }
  ];

  const isBaseline = Cypress.env('baseline');

  beforeEach(() => {
    cy.visit('/');
  });

  scenarios.forEach(({ cookiesAccepted, description }) => {
    breakpoints.forEach(({ name, width }) => {
      it(`should verify visual appearance on ${description} at ${width}px`, () => {
        cy.viewport(width, 800);

        if (cookiesAccepted) {
          cy.get('.CookieButton.CookieButton-primary')
            .should('be.visible')
            .click();
        } else {
          cy.get('.CookieButton.CookieButton-primary').should('be.visible');
        }

        const fileName = `homepage-${description}-${name}`;
        const baseFolder = 'cypress/screenshots/base';
        const compareFolder = 'cypress/screenshots/compare';
        const diffFolder = 'cypress/screenshots/diff';

        if (isBaseline) {
          cy.screenshot(`${baseFolder}/${fileName}`);
        } else {
          cy.screenshot(`${compareFolder}/${fileName}`);
          cy.readFile(`${baseFolder}/${fileName}.png`, 'base64').then((baseImageBase64) => {
            const baseImageBuffer = Buffer.from(baseImageBase64, 'base64');
            const baseImage = PNG.sync.read(baseImageBuffer);

            cy.readFile(`${compareFolder}/${fileName}.png`, 'base64').then((compareImageBase64) => {
              const compareImageBuffer = Buffer.from(compareImageBase64, 'base64');
              const compareImage = PNG.sync.read(compareImageBuffer);

              const diff = new PNG({ width: baseImage.width, height: baseImage.height });
              const numDiffPixels = pixelmatch(baseImage.data, compareImage.data, diff.data, baseImage.width, baseImage.height);

              cy.writeFile(`${diffFolder}/${fileName}-diff.png`, PNG.sync.write(diff), 'base64');

              expect(numDiffPixels).to.be.lessThan(100); // Adjust to your tolerance level
            });
          });
        }
      });
    });
  });
});