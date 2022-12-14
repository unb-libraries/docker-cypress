const { defineConfig } = require('cypress')
const glob = require('glob')
const fs = require('fs')
const path = require('path')
const cypressDir = process.cwd()
const bundler = require('@cypress/webpack-preprocessor')

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

function findPluginPreprocessors(plugins) {
  return Object.values(plugins).reduce((pps, plugin) => {
    const { preprocessors: pluginPps } = require(plugin.path)
    return pluginPps
      ? {...pps, ...pluginPps}
      : pps
  }, {})
}

const env = process.env
const config = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.pluginsFolder = 'support/plugins'
      config.plugins = findPlugins(config.pluginsFolder)

      const tasks = findPluginTasks(config.plugins)
      if (tasks) {
        on('task', tasks)
      }

      const preprocessors = findPluginPreprocessors(config.plugins)
      if (Object.values(preprocessors).length > 0) {
        on('file:preprocessor', (file) => {
          let { filePath, shouldWatch } = file

          if (!filePath.match(/.*\/e2e\/.*/)) {
            return bundler()(file)
          }

          let outputPath = filePath
          let spec = fs.readFileSync(outputPath, 'utf8')
          Object.values(preprocessors).forEach(pp => {
            if (pp.applies(outputPath)) {
              spec = pp.transform(spec)
              outputPath = `/tmp/${path.basename(outputPath, path.extname(outputPath))}${pp.extname}`
            }
          })
          fs.writeFileSync(outputPath, spec)

          if (shouldWatch && filePath !== outputPath) {
            fs.watch(filePath, () => {
              file.emit('rerun')
            })
          }

          return outputPath
        })
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