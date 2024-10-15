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

      // Conditionally set the base URL based on an environment variable or a default
      const environment = config.env.environment || 'dev'; // This could be a CLI argument too
      config.baseUrl = config.env[`${environment}Url`] || 'http://localhost:3000'; // Default fallback

      return config;
    },
    // Define different URLs here for each environment
    env: {
      devUrl: 'http://workco-2020-dev.s3-website-us-east-1.amazonaws.com/',
      prodUrl: 'http://work.co',
      baseline: true, // Default to baseline capture
    },
    specPattern: 'cypress/e2e/**/*.{js,ts}',
  },
});