Object.values(Cypress.config().plugins).forEach(plugin => {
  const { commands } = require(`./plugins/${plugin.relativePath}`)

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
})