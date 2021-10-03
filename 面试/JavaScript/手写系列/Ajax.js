function ajax ({
  url = '',
  type = 'GET',
  data = null,
  success = (response) => response,
  error = () => {}
} = {}) {
  type = (type || 'GET').toUpperCase()
  data = data || {}

  // 避免特殊字符，对 value 进行 encode
  const dataStr = Object.keys(data).reduce((res, key, i, keys) => {
    res += `${key}=${encodeURIComponent(data[key])}${i < keys.length - 1 ? '&' : ''}`
    return res
  }, '')

  const xhr = new XMLHttpRequest()
  // 监听事件，只要 readyState 的值变化，就会调用 readystatechange
  xhr.onreadystatechange = function () {
    // readyState 属性表示请求/响应过程的当前活动阶段
    //   4 为完成，已经接收到全部响应数据
    if (xhr.readyState === 4) {
      // status: 响应的 HTTP 状态码，以 2 开头的都是成功
      const status = xhr.status
      if (status >= 200 && status < 300) {
        let response = null
        // 接收数据的内容类型
        const type = xhr.getResponseHeader('Content-Type')
        if (type.indexOf('xml') !== -1 && xhr.responseXML) {
          response = xhr.responseXML // Document 对象响应
        } else if (type === 'application/json') {
          response = JSON.parse(xhr.responseText) // JSON 响应
        } else {
          response = xhr.responseText // 字符串响应
        }

        // 成功回调函数
        success && success(response)
      } else {
        // 失败回调函数
        error && error(status)
      }
    }
  }

  // 连接和传输数据
  if (type === 'GET') {
    // open 三个参数分别是：请求方式、请求地址、是否异步请求
    xhr.open(type, url + '?' + dataStr, true)
    xhr.send(null)
  } else {
    xhr.open(type, url, true)
    // 设置提交时的内容类型
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    xhr.send(data) // 传输数据
  }
}

ajax({
  url: 'http://localhost:8080/api/ajax',
  data: {
    id: 1
  },
  success: function (response) {
    console.log(response, typeof response)
  }
})
