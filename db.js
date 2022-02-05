const knex = require('knex')

module.exports = knex({
  client: 'postgres',
  connection: {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'database',
  },
})