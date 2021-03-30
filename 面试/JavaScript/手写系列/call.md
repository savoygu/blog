## 实现 call

### 代码实现

**提示**：原生的 `call` 与 `apply` 只有在参数处理方面有差异，因此这里直接调用了 [apply](./apply.md) 的实现

```javascript
Function.prototype.call3 = Function.prototype.call || function (that) {
  const args = []
  for (let i = 0; i < arguments.length; i++) {
    args[i] = arguments[i]
  }
  return this.apply3(that, args)
}
```

### 参考：  

- [面试官问：能否模拟实现JS的call和apply方法 — 若川](https://juejin.cn/post/6844903728147857415)
