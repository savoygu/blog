// 支持多个请求
function jsonp ({
  url,
  params = {},
  callbackKey = 'jsonCallback',
  callback = () => {}
}) {
  const cid = jsonp.cid = (jsonp.cid || 0)

  jsonp.cbs = jsonp.cbs || []
  jsonp.cbs[cid] = callback

  params[callbackKey] = `jsonp.cbs[${cid}]`

  const paramsStr = Object.keys(params).reduce((res, key, i, data) => {
    res += `${key}=${encodeURIComponent(params[key])}${i < data.length - 1 ? '&' : ''}`
    return res
  }, '')

  const script = document.createElement('script')
  script.setAttribute('src', `${url}?${paramsStr}`)
  document.body.appendChild(script)

  jsonp.cid++
}

jsonp({
  url: 'http://localhost:8080/api/jsonps',
  params: {
    a: '2&b=3',
    b: '4'
  },
  // callbackKey: 'cb',
  callback (res) {
    console.log(res)
  }
})

// 简单版
// function jsonp({
//   url,
//   params = {},
//   callbackKey = "jsonCallback",
//   callback = () => {},
// }) {
//   params['jsonCallback'] = callbackKey
//   window[callbackKey] = callback // 添加到 window 上

//   console.log(callbackKey, params)

//   const paramsStr = Object.keys(params).reduce((res, key, i, data) => {
//     res += `${key}=${encodeURIComponent(params[key])}${i < data.length - 1 ? '&' : ''}`
//     return res
//   }, '')

//   const script = document.createElement('script')
//   script.setAttribute('src', `${url}?${paramsStr}`)
//   document.body.appendChild(script)
// }

// jsonp({
//   url: 'http://localhost:8080/api/jsonp',
//   params: { id: 1 },
//   callbackKey: 'cb1',
//   callback (res) {
//       console.log(res) // No.1
//   }
// })
// jsonp({
//   url: 'http://localhost:8080/api/jsonp',
//   params: { id: 2 },
//   callbackKey: 'cb2',
//   callback (res) {
//       console.log(res) // No.2
//   }
// })
