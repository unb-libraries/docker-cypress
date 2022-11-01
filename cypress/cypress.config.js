const { defineConfig } = require('cypress')

const env = process.env
const config = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const glob = require('glob')
      
      const pluginDir = 'support/plugins'
      const plugins = glob.sync('contrib/*.js', {
        cwd: pluginDir
      }).map(filename => filename.split('.')[0])

      on('task', plugins.reduce((all, plugin) => {
        const { tasks } = require(`./${pluginDir}/${plugin}`)
        return tasks ? {...all, ...tasks} : all
      }, {}))
      
      config.plugins = {
        ...Object.fromEntries(plugins.map(plugin => [plugin, {}])),
        custom: {},
      }
      
      return config
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