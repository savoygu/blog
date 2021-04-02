## 实现 jsonp 

[jsonp](./jsonp/jsonp.js) 源码

### 基本原理

利用 script 标签的 src 没有跨域限制来完成跨域目的。

### 执行过程

 1. 前端定义一个解析函数：jsonpCallBack = function (res) {}
 2. 通过 params 的形式包装 script 标签的请求参数，并且声明执行函数，如：cb = jsonpCallBack
 3. 后端获取前端声明的执行函数（jsonpCallBack），并且带上参数且调用函数的方式传递给前端
 4. 前端再 script 标签返回资源的时候就会执行 jsonpCallBack 并通过回调函数的方式拿到数据。

### 优缺点

缺点：
-  只能进行 GET 请求

优点：
- 兼容性好，在一些古老的浏览器中都可以运行。

### 代码实现

####  :woman_technologist::technologist: 简单版

```javascript
function jsonp({
  url,
  params = {},
  callbackKey = "jsonCallback", // 后端接收 callbackKey 参数获取 callbackName
  callbackName = "cb" // 调用 window[callbackName](...args)
  callback = () => {},
}) {
  params[callbackKey] = callbackName
  window[callbackName] = callback // 添加到 window 上
  
  const paramsStr = Object.keys(params).reduce((res, key, i, data) => {
    res += `${key}=${encodeURIComponent(params[key])}${i < data.length - 1 ? '&' : ''}`
    return res
  }, '')

  const script = document.createElement('script')
  script.setAttribute('src', `${url}?${paramsStr}`)
  document.body.appendChild(script)
}
```

存在的问题，为了防止回调被覆盖，每个 jsonp 请求都需要传入 callbackName 并在 window 上定义 callbackName 函数，这样会对全局环境造成污染。

####  :woman_technologist::technologist: 完整版 — 多个请求
 
- 让 callbackName 是一个唯一的，可以使用 id 递增的方式
- 把回调定义在 jsonp.cbs 数组上，避免污染全局环境

```javascript
function jsonp ({
  url, 
  params = {}, 
  callbackKey = 'jsonCallback',
  callback = () => {}, 
}) {
  const cid = jsonp.cid = (jsonp.cid || 0)

  jsonp.cbs = jsonp.cbs || []
  jsonp.cbs[cid] = callback
  
  params[callbackKey] = `jsonp.cbs[${cid}]`

  // 拼接参数
  const paramsStr = Object.keys(params).reduce((res, key, i, data) => {
    res += `${key}=${encodeURIComponent(params[key])}${i < data.length - 1 ? '&' : ''}`
    return res
  }, '')

  // 创建 script
  const script = document.createElement('script')
  script.setAttribute('src', `${url}?${paramsStr}`)
  document.body.appendChild(script)

  jsonp.cid++ // id 自增
}
```

### 参考：  

- [JSONP原理及实现 — LinDaiDai_霖呆呆](https://www.jianshu.com/p/88bb82718517)
