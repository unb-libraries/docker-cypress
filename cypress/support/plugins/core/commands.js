const log = (originalFn, msg) => {
  cy.task('log', msg, {log: false})
  originalFn(msg)
}

module.exports = {
  commands: [
    {name: "log", method: "overwrite", fn: log},
  ]
}