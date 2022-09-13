const { defineConfig } = require('cypress')

const env = process.env
const config = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const glob = require("glob")
      glob(`${require.main.path}/plugins/**/*.plugin.js`, {}, (err, plugins) => {
        if (!err && plugins) {
          config.plugins = plugins
        }
      })
      return config
    },
    experimentalSessionAndOrigin: true,
    fixturesFolder: "fixtures",
    reporter: "spec",
    plugins: [],
    specPattern: 'e2e/**/*.cy.js',
    screenshotOnRunFailure: false,
    video: false
  }
})

if (env.BASE_URL) {
  config.e2e.baseUrl = env.BASE_URL
}

module.exports = config
