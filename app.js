import Koa from 'koa'
import Router from 'koa-router'

const app = new Koa()
const router = new Router()
app.use(router.routes(), router.allowedMethods())
router.get('/api/get', ctx => {
  ctx.body = {
    data: 'hello nodejs'
  }
})

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
  console.log(`Service started on port ${PORT}`);
})