## 实现 apply

### 实现要点

  1. 属性同名覆盖

     - ES5 随机数 + 缓存原始值
     - ES6 `Symbol`

  2. 参数传递

     - ES5 `new Function`
     - ES6 扩展运算符 (`...`)

**注意**：ES5 参数传递 使用了 `new Function` 而不是 `eval` ，是因为面试官或许会要求不使用 eval 如何实现?!

### 代码实现

**提示**: ES5 和 ES6 代码对参数的处理是一致的

ES5 

```javascript
Function.prototype.apply3 = Function.prototype.apply || function (that, args) {
  const target = this
  if (typeof target !== 'function') {
    throw new TypeError('Function.prototype.apply3 called on incompatible ' + target)
  }

  if (args === 'undefined' || args === null) {
    args = []
  }

  if (args !== new Object(args)) {
    throw new TypeError('CreateListFromArrayLike called on non-object')
  }

  if (typeof that === 'undefined' || that === null) {
    that = typeof window !== 'undefined' ? window : global
  }

  that = new Object(that)

  // 与 ES6 不同的实现
  const fn = '$' + +new Date()
  const originalVal = that[fn]
  const hasOriginalVal = that.hasOwnProperty(fn)
  that[fn] = target
  const argsLength = args.length
  const spreadArgs = new Array(argsLength)
  for (let i = 0; i < argsLength; i++) {
    spreadArgs[i] = 'args[' + i + ']'
  }
  const result = Function('obj', 'fn', 'args', 'return obj[fn](' + spreadArgs.join(',') + ')')(that, fn, args)
  delete that[fn]
  if (hasOriginalVal) {
    that[fn] = originalVal
  }
  return result
}
```

ES6

```javascript
Function.prototype.apply3 = Function.prototype.apply || function (that, args) {
  const target = this
  if (typeof target !== 'function') {
    throw new TypeError('Function.prototype.apply3 called on incompatible ' + target)
  }

  if (args === 'undefined' || args === null) {
    args = []
  }

  if (args !== new Object(args)) {
    throw new TypeError('CreateListFromArrayLike called on non-object')
  }

  if (typeof that === 'undefined' || that === null) {
    that = typeof window !== 'undefined' ? window : global
  }

  that = new Object(that)

  // 与 ES5 不同的实现
  const fn = Symbol()
  that[fn] = target
  const result = that[fn](...args)
  delete that[fn]
  return result
}
```

### 参考：  

- [面试官问：能否模拟实现JS的call和apply方法 — 若川](https://juejin.cn/post/6844903728147857415)
