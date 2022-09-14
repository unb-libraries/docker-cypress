const { defineConfig } = require('cypress')
const glob = require('glob')

const env = process.env
const config = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const cwd = '/cypress/support'
      const plugins = glob.sync('plugins/**/*.plugin.js', {cwd: cwd})
      on('task', plugins.reduce((all, plugin) => {
        const { tasks } = require(`${cwd}/${plugin}`)
        return tasks ? {...all, ...tasks} : all
      }, {}))
      config.plugins = plugins
      return config
    },
    experimentalSessionAndOrigin: true,
    fixturesFolder: "fixtures",
    reporter: "spec",
    plugins: [],
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