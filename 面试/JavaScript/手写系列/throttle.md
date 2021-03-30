## 实现 throttle 

> 如果你持续触发事件，每隔一段时间，只执行一次事件。

### 代码实现

定时器

**理解点**: 一旦生成定时器，只有等 `wait` 毫秒，当定时器执行后(`timer` 没了，`func` 函数也被执行了)，才能重新去生成定时器...

```javascript
function throttle(func, wait) {
  let timer = null
  return function() {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        func.apply(this, arguments)
      }, wait)
    }
  }
}
```

时间戳

**理解点**：记录上次执行时间，如果当前时间与上次时间的间隔大于 `wait`，就会执行 `func`，同时更新上次时间为当前时间。

```javascript
function throttle(func, wait) {
  let last = 0
  return function() {
    const now = +new Date()
    if (now - last > wait) {
      func.apply(this, arguments)
      last = now
    }
  }
}
```

**定时器与时间戳的不同点**：

- 时间戳会让 func 先执行一次 (初始 last 为 0，必有 `now - last > wait`)
- 

### 参考：  

- []()
