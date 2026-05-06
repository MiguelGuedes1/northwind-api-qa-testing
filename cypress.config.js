const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'docs/cypress/cypress-report',
      overwrite: false,
      html: true,
      json: true
    }
  }
})