const home = require('./home')
const systemsList = require('./systems-list')
const materials = require('./materials')

module.exports = app => {
  app.use('/', home)
  app.use('/systems-list', systemsList)
  app.use('/materials', materials)
}