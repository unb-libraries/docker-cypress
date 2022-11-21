const { commands, selectors, workflows } = Object
  .values(Cypress.config().plugins)
  .reduce(({commands, selectors, workflows}, plugin) => {
    const { commands: pCommands, selectors: pSelectors, workflows: pWorkflows } = require(`./plugins/${plugin.relativePath}`)
    return {
      commands: { ...commands, ...pCommands },
      selectors: { ...selectors, ...pSelectors },
      workflows: { ...workflows, ...pWorkflows },
    }}, {commands: {}, selectors: {}, workflows: {} })

Object.entries(commands)
  .forEach(([name, { fn, method = 'add', type = 'parent', subject = false }]) => {
    if (method === 'add') {
      Cypress.Commands.add(name, {
        prevSubject: type === 'parent'
          ? false
          : subject,
      }, fn)
    }
    else {
      Cypress.Commands.overwrite(name, fn)
    }
  })

function Workflows() {
  this.workflows = {}
}

Workflows.prototype.add = function (id, workflowFn) {
  this.workflows[id] = workflowFn
}

Workflows.prototype.run = function (id, context) {
  return this.workflows[id](context)
}

Cypress.$Cypress.prototype.Workflows = new Workflows()
Object.entries(workflows).forEach(([id, workflowFn]) => Cypress.Workflows.add(id, workflowFn))

Cypress.Commands.overwrite('get', (originalFn, selector, options) => {
  // Match shortcuts such as "widget:input:title" to get the form input element with the name "title"
  if (selector.match(/^[a-zA-Z-_]+(\:([0-9a-zA-Z-_])+)+$/)) {
    const base = selector.substring(0, selector.lastIndexOf(':'))
    const name = selector.substring(selector.lastIndexOf(':') + 1)
    if (selectors.hasOwnProperty(base)) {
      return originalFn(selectors[base](name), options)
    }
  }
  return originalFn(selector, options)
})