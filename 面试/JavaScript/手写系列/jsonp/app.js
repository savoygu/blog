const Koa = require('koa');
const app = new Koa();
const items = [{ id: 1, title: 'title1' }, { id: 2, title: 'title2' }]

app.use(async (ctx, next) => {
  if (ctx.path === '/api/jsonp') {
    const { jsonCallback: cb, id } = ctx.query;
    console.log(cb)
    const title = items.find(item => item.id == id) ? items.find(item => item.id == id)['title'] : ''
    ctx.body = `${cb}(${JSON.stringify({title})})`;
    return;
  }
  if (ctx.path === '/api/jsonps') {
    const { jsonCallback: cb, a, b } = ctx.query;
    ctx.body = `${cb}(${JSON.stringify({ a, b })})`;
    return;
  }
})
console.log('listen 8080...')
app.listen(8080);