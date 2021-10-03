const Koa = require('koa')
const cors = require('@koa/cors')
const app = new Koa()
const items = [{ id: 1, title: 'title1' }, { id: 2, title: 'title2' }]

app.use(cors())

app.use(async (ctx) => {
  const { path, query } = ctx
  let body = 'not found'
  if (path === '/api/jsonp') {
    const { jsonCallback: cb, id } = query
    const item = items.find(item => item.id === +id)
    const title = item ? item.title : ''
    body = `${cb}(${JSON.stringify({title})})`
  } else if (path === '/api/jsonps') {
    const { jsonCallback: cb, a, b } = query
    body = `${cb}(${JSON.stringify({ a, b })})`
  } else if (path === '/api/ajax') {
    const { id } = query
    const item = items.find(item => item.id === +id)
    body = item
  }
  ctx.body = body
})

app.listen(8080, () => {
  console.log('listen 8080...')
})
