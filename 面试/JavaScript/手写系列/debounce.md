## 实现 debounce (函数防抖)

> 事件停止触发后 n 秒才执行函数一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。

### 使用场景

- 浏览器窗口的 resize 事件
  - 计算窗口大小
- 拖拽时的 mousemove 事件
- 键盘事件 keyup、input、click
  - 用户名、手机号、邮箱是否已存在验证
  - 输入框远程搜索
  - 防止表单重复提交

### 代码实现

#### :woman_technologist::technologist: 简单版

```javascript
/**
 * 简单版
 * @param {Function} func 函数
 * @param {Number} wait 等待时间
 */
function debounce(func, wait) {
  let timer
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, arguments)
    }, wait)
  }
}
```

#### :woman_technologist::technologist: 立即执行

**提示**： 立即执行是指，不希望等到事件停止触发后才执行，希望立刻执行函数，然后等到停止触发 n 秒后，才可以重新触发执行。

```javascript
/**
 * 有头无尾 & 无头有尾
 * @param {Function} func 函数
 * @param {Number} wait 等待时间
 * @param {Boolean} immediate 是否立即执行
 */
function debounce (func, wait, immediate) {
  let timer, result
  const debounced = function () {
    if (timer) clearTimeout(timer)

    if (immediate) { // 立即执行
     // 如果已经执行过，timer 不为 null，func 不再执行，只有当停止事件触发 wait 秒后，
     //   timer 重新为 null，才会再次执行 func
      const callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, wait)
      if (callNow) result = func.apply(this, arguments)
    } else {
      timer = setTimeout(() => {
        func.apply(this, arguments)
      }, wait)
    }

    return result
  }

  debounced.cancel = function () { // 取消
    clearTimeout(timer)
    timer = null
  }

  return debounced
}
```

### 参考：  

- [JavaScript专题之跟着underscore学防抖 — mqyqingfeng](https://github.com/mqyqingfeng/Blog/issues/22)
