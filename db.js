import knex from 'knex'
// const knex = require('knex')
const db = knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    port: 3310,
    user: 'root',
    password: '123456',
    database: 'db'
  }
})

export {
  db
}