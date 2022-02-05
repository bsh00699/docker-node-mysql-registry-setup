const db = require('../db')

  ; (async () => {
    try {
      await db('users').insert({ name: 'John Doe' })
      process.exit(0)
    } catch (err) {
      console.log(err)
      process.exit(1)
    }
  })()