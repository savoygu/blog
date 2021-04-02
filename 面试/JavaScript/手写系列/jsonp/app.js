const Koa = require('koa');
const cors = require('@koa/cors')
const app = new Koa();
const items = [{ id: 1, title: 'title1' }, { id: 2, title: 'title2' }]

app.use(cors())

app.use(async (ctx, next) => {
  if (ctx.path === '/api/jsonp') {
    const { jsonCallback: cb, id } = ctx.query;
    console.log(cb)
    const item = items.find(item => item.id === +id) 
    const title = item ? item.title : ''
    ctx.body = `${cb}(${JSON.stringify({title})})`;
    return;
  }
  if (ctx.path === '/api/jsonps') {
    const { jsonCallback: cb, a, b } = ctx.query;
    ctx.body = `${cb}(${JSON.stringify({ a, b })})`;
    return;
  }

  if(ctx.path === '/api/ajax') {
    const { id } = ctx.query
    const item = items.find(item => item.id === +id)
    ctx.body = item
    return
  }
})
console.log('listen 8080...')
app.listen(8080);