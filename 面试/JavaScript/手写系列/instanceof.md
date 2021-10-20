## 实现一个 instanceof 

> MDN: `instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

### 代码实现

```javascript
function _instanceof(L, R) {
  const O = R.prototype
  L = L.__proto__

  while(true) {
    if (L === null) return false
    if (L === O) return true
    L = L.__proto__
  }
}
```
