const { defineConfig } = require('cypress')

const env = process.env
const config = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const glob = require("glob")
      glob(`${require.main.path}/plugins/**/cypress.plugin.js`, {}, (err, plugins) => {
        if (!err) {
          config.plugins = plugins
        }
      })
    },
    experimentalSessionAndOrigin: true,
    fixturesFolder: "fixtures",
    reporter: "spec",
    specPattern: 'e2e/**/*.cy.js',
    screenshotOnRunFailure: false,
    supportFile: "support/index.js",
    video: false
  }
})

if (env.BASE_URL) {
  config.e2e.baseUrl = env.BASE_URL
}

module.exports = config
