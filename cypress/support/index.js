const glob = require("glob")

glob(`${require.main.path}/**/support.js`, {}, (err, files) => {
  if (!err) {
    files.forEach(filename => {
      const plugin = require(filename)
      plugin.commands.forEach(cmd => {
        switch(cmd.method) {
          case "overwrite":
            // Cypress.Commands.overwrite(cmd.name, cmd.fn); break
            console.log(cmd)
          case "create":
          default:
            // Cypress.Commands.add(cmd.name, cmd.options || {prevSubject: false}, cmd.fn)
            console.log(cmd)
        }
      })
    })
  }
})