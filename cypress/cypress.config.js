const { defineConfig } = require('cypress')

const env = process.env
const config = defineConfig({
  e2e: {
    experimentalSessionAndOrigin: true,
    reporter: "spec",
    specPattern: 'e2e/**/*.cy.js',
    screenshotOnRunFailure: false,
    supportFile: "support.js",
    video: false
  }
})

if (env.BASE_URL) {
  config.e2e.baseUrl = env.BASE_URL
}

module.exports = config
