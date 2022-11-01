const { defineConfig } = require('cypress')
const glob = require('glob')
const cypressDir = process.cwd()

function findPlugins(pluginsFolder) {
  const plugins = glob.sync('*.js', {
    cwd: `${pluginsFolder}/contrib`
  }).map(filename => {
    const name = filename.split('.')[0]
    return [name, {
      name,
      path: `${cypressDir}/${pluginsFolder}/contrib/${filename}`,
      relativePath: `contrib/${filename}`,
    }]
  })

  return {
    ...Object.fromEntries(plugins),
    custom: {
      name: "custom",
      path: `${cypressDir}/${pluginsFolder}/custom/index.js`,
      relativePath: `custom/index.js`,
    },
  }
}

function findPluginTasks(plugins) {
  return Object.values(plugins).reduce((tasks, plugin) => {
    const { tasks: pluginTasks } = require(plugin.path)
    return pluginTasks
      ? {...tasks, ...pluginTasks}
      : tasks
  }, {})
}

const env = process.env
const config = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.pluginsFolder = 'support/plugins'
      config.plugins = findPlugins(config.pluginsFolder)

      const tasks = findPluginTasks(config.plugins)
      on('task', tasks)
      
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