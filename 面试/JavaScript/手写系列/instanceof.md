### 实现一个 instanceof 

#### 代码实现

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