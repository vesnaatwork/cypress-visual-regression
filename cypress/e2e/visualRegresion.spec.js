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
        const folder = isBaseline ? 'cypress/screenshots/base' : 'cypress/screenshots/compare';

        cy.captureScreenshot(fileName, folder);
      });
    });
  });
});