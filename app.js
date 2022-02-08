import Koa from 'koa'
import Router from 'koa-router'
import { db } from './db.js'

const app = new Koa()
const router = new Router()
let visit = 0
app.use(router.routes(), router.allowedMethods())
router.get('/api/get', ctx => {
  visit++
  ctx.body = {
    data: `hello nodejs-${visit}`
  }
})
router.get('/api/users', async (req, res) => {
  const users = await db.select('name').table('users')
  ctx.body = {
    data: users
  }
})

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
  console.log(`Service started on port ${PORT}`);
})