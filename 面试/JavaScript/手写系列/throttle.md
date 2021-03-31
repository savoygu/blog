## 实现 throttle 

> 如果你持续触发事件，每隔一段时间，只执行一次事件。

### 代码示例

[throttle](https://codepen.io/savoygu/pen/gOgLKYG)

### 代码实现

#### 定时器

**理解点**: 一旦生成定时器，只有等 `wait` 毫秒，当定时器执行后(`timer` 没了，`func` 函数也被执行了)，才能重新去生成定时器...

```javascript
/**
 * 定时器
 * @param {Function} func 函数
 * @param {Number} wait 等待时间
 */
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

#### 时间戳

**理解点**：记录上次执行时间，如果当前时间与上次时间的间隔大于 `wait`，就会执行 `func`，同时更新上次时间为当前时间。

```javascript
/**
 * 时间戳
 * @param {Function} func 函数
 * @param {Number} wait 等待时间
 */
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

- 时间戳在事件触发时会让 func 先执行一次 (初始 last 为 0，必有 `now - last > wait`)，而定时器需要等 `wait` 毫秒
- 定时器在事件停止触发后会再执行一次 (产生了一个 timer)，而时间戳不满足 `now - last > wait`

#### 时间戳与定时器结合(有头有尾)

**提示**: 有头有尾指的是，鼠标移入能立刻执行，事件停止触发的时候还能再执行一次！

```javascript
/**
 * 有头有尾
 * @param {Function} func 函数
 * @param {Number} wait 等待时间
 */
function throttle(func, wait) {
  let timer,
    last = 0

  const throttled = function () {
    const now = +new Date()
    const remaining = wait - (now - last) // 下次触发 func 剩余的时间

    // 如果没有剩余的时间了或者你改了系统时间
    //   now 设置成了比 last 更前的时间，导致 now - last 为负值，从而有 remaining > wait
    if (remaining <= 0 || remaining > wait) { // 头
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      last = now
      func.apply(this, arguments)
    } else if (!timer) { // 中间 + 尾
      timer = setTimeout(() => {
        last = now
        timer = null
        func.apply(this, arguments)
      }, remaining)
    }
  }
  return throttled
}
```

#### 时间戳与定时器结合(可控的有头有尾)

```javascript
/**
 * 有头无尾 & 无头有尾
 * @param {Function} func 函数
 * @param {Number} wait 等待时间
 * @param {Object} options 等待时间
 * @param {Boolean} [options.leading=true] - 是否第一次执行，为 false 表示不执行
 * @param {Boolean} [options.tailing=true] - 是否执行事件停止时触发的timer，为 false 表示不执行
 */
function throttle(func, wait, options = {}) {
  let timer,
    last = 0
  if (!options) options = {}

  const throttled = function () {
    const now = +new Date()
   // 第一次执行时直接让 last 赋值为 now，使得 remaining 为 wait，
   //   让第一次执行失效，从而进入到 timer 的逻辑
    if (!last && options.leading === false) last = now
    const remaining = wait - (now - last)

    if (remaining <= 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      last = now
      func.apply(this, arguments)
    } else if (!timer && options.trailing !== false) {
      timer = setTimeout(() => {
        last = options.leading === false ? 0 : now
        timer = null
        func.apply(this, arguments)
      }, remaining)
    }
  }

  throttled.cancel = function () {
    clearTimeout(timer)
    last = 0
    timer = null
  }

  return throttled
}
```

**注意**: `leading：false` 和 `trailing: false` 不能同时设置

如果同时设置的话，事件触发的时候，因为 `trailing` 设置为 `false`(定时器无法被触发)，所以只要再过了设置的时间 `wait`，再重新触发事件的话，就会立刻执行(因为 `last` 不是 `0` 了，无法满足 `!last && options.leading === false`， 导致 `remaining <= 0`，会在事件触发时立即进行第一次执行)，就违反了 `leading: false`，与设置的 options 参数相牟盾，因此，这个 throttle 只有三种用法：

```javascript
// 第一种: 有头有尾
throttle(getUserAction, 1000);

// 第二种: 无头有尾
throttle(getUserAction, 1000, {
    leading: false
});

// 第三种: 有头无尾
throttle(getUserAction, 1000, {
    trailing: false
});
```

### 参考：  

- [JavaScript专题之跟着 underscore 学节流 — mqyqingfeng](https://github.com/mqyqingfeng/Blog/issues/26)
