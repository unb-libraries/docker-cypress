module.exports = {
  commands: {
    console: {
      fn: (obj) => cy.task('console', obj),
    },
  },
  tasks: {
    console(obj) {
      console.debug(obj)
      return null
    },
  },
}