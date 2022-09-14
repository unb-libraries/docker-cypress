Cypress.config().plugins.forEach(name => {
  const plugin = require(`./${name}`)
  plugin.commands.forEach(cmd => {
    switch(cmd.method) {
      case "overwrite":
        Cypress.Commands.overwrite(cmd.name, cmd.fn); break
      case "create":
      default:
        Cypress.Commands.add(cmd.name, cmd.options || {prevSubject: false}, cmd.fn)
    }
  })
})