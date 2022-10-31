Object.entries(Cypress.config().plugins).forEach(([name, options]) => {
  const { commands } = require(`./plugins/${name}`)

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