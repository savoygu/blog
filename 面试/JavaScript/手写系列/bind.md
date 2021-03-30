## 实现 call

### 实现要点

1. 返回的函数可以被 new (new.target, instanceof)
2. 返回的函数有形参长度(Function 去构造)
3. 绑定函数原型 

### 代码实现

ES5

```javascript
Function.prototype.bind3 = Function.prototype.bind || function (that) {
  var target = this
  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.bind called on incompatible ' + target)
  }

  var args = [].slice(arguments, 1)

  var bound = function() {
    var boundArgs = [].slice.call(arguments);
    var finalArgs = args.concat(boundArgs);
    if(this instanceof bound){
        return target.apply(this, finalArgs);
    } else{
        return target.apply(thisArg, finalArgs);
    }
  }

  if(target.prototype){
    const Empty = function() {}
    Empty.prototype = target.prototype;
    bound.prototype = new Empty();
    Empty.prototype = null
  }

  return bound
}
```

ES6

```javascript
Function.prototype.bind3 = Function.prototype.bind || function (that) {
  const target = this
  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.bind called on incompatible ' + target)
  }

  const args = [...arguments].slice(1)
  const bound = function() {
    if (typeof new.target !== 'undefined') {
      return new target(...args, ...arguments)
    }
    return target.apply(that, args.concat(...arguments))
  }

  if(target.prototype){
    bound.prototype = Object.create(target.prototype)
  }

  return bound
}
```

es5-shim

- 相对于其他版本，实现了形参长度

```javascript
Function.prototype.bind3 = Function.prototype.bind || function(that) {
  const target = this
  if (typeof target !== 'function') {
    throw new TypeError('Function.prototype.bind called on incompatible ' + target)
  }
  
  const args = [].slice.call(arguments, 1)
  let bound
  const binder = function() { // 要点 1
    // this instanceof bound 不是很准确，可以使用 ES6 new.target
		if (this instanceof bound) { // typeof new.target !== 'undefined'
      const result = target.apply(this, args.concat([].slice.call(arguments)))
      if (Object(result) === result) {
//       if (result !== null && typeof result === 'object' 
//         || typeof result === 'function')
        return result
      }
      return this
    } else {
      return target.apply(that, args.concat([].slice.call(arguments)))
    }
  }
  
  const boundLength = Math.max(0, target.length - args.length)
  const boundArgs = new Array(boundLength)
  for (let i = 0; i< boundLength; i++) {
    boundArgs[i] = '$' + i
  }
  // 利用 Function 构造方式生成形参 length $0, $1, $2...
  bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments) }')(binder) // 要点 2
  // target 可能是 ES6 的箭头函数，没有 prototype 或者 prototype 被修改为 falsy 值
  if (target.prototype) { // 要点 3
    const Empty = function () {}
    Empty.prototype = target.prototype
    bound.prototype = new Empty()
    Empty.prototype = null
    // bound.prototype = Object.create(target.prototype)
  }
	return bound
}
```

对于下面实例化 `bind` 情况下，判断返回值是否是 Object 的处理不是很必要，因为 `new` 操作符本身就会这样做。

```javascript
if (this instanceof bound) { // typeof new.target !== 'undefined'
  const result = target.apply(this, args.concat([].slice.call(arguments)))
  if (Object(result) === result) {
//       if (result !== null && typeof result === 'object' 
//         || typeof result === 'function')
    return result
  }
  return this
}
```

可以替换为

```javascript
if (this instanceof bound) {
  return target.apply(this, args.concat([].slice.call(arguments)))
}
```

### 参考：  

- [面试官问：能否模拟实现JS的bind方法 — 若川](https://juejin.cn/post/6844903718089916429)
