## 实现 new

### 实现步骤

1. 创建一个全新的对象
2. 这个对象会被执行 `[[Prototype]]` (也就是 `__proto__` 链接)
3. 生成的新对象会绑定到函数调用的 this
4. 通过 new 创建的每个对象将最终被 `[[Prototype]]` 链接到这个函数的 `prototype` 对象上
5. 如果函数没有返回对象类型 `Object`(包含 `Function`、`Array`、`Date`、`RegExp`、`Error`)，那么 `new` 表达式中的函数会自动返回这个新的对象

### 代码实现

```javascript
function _new(Ctor) {
  if (typeof Ctor !== 'function') {
    throw new TypeError(Ctor + ' is not a constructor')
  }

  // es6
  _new.target = Ctor
  const obj = Object.create(Ctor.prototype) // 步骤 1，2，4
  const args = [].slice(arguments, 1)
  const result = Ctor.apply(obj, args) // 步骤 3
  const isObject = result !== null && typeof result === 'object'
  const isFunction = typeof result === 'function'
  if (isObject || isFunction) { // 步骤 5
    return result
  }
  return obj
}
```

### 参考：

- [面试官问：能否模拟实现JS的new操作符 — 若川](https://juejin.cn/post/6844903704663949325)
