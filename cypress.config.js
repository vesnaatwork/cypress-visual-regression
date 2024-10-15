const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });

      const environment = config.env.environment || 'dev'; // Default to 'dev'

      // Define base URLs for environments
      const urls = {
        dev: config.env.devUrl,
        prod: config.env.prodUrl,
      };

      config.baseUrl = urls[environment];
      return config;
    },
    // Define different URLs here for each environment
    env: {
      devUrl: 'http://workco-2020-dev.s3-website-us-east-1.amazonaws.com/',
      prodUrl: 'http://work.co',
      baseline: process.env.CYPRESS_CAP===true, // Uses the environment variable to set baseline functionality
    },
    specPattern: 'cypress/e2e/**/*.{js,ts}',
  },
});