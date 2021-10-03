## 实现深度克隆 deepClone 

### 深拷贝和浅拷贝定义

**浅拷贝**:  
创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址 ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。

**深拷贝**:  
将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且修改新对象不会影响原对象


### 代码实现

#### :woman_technologist::technologist: 简单版 — 只支持 数组和对象

```javascript
const deepClone = obj => {
  if (obj === null) return null;
  let clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    key =>
      (clone[key] =
        typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
  );
  if (Array.isArray(obj)) {
    clone.length = obj.length;
    return Array.from(clone);
  }
  return clone;
};
```

#### :woman_technologist::technologist: 升级版 — 支持循环引用

```javascript
function clone(target, map = new WeakMap()) {
  if (!Array.isArray(target) || !(typeof !== null && typeof === 'object')) return target
  const isArray = Array.isArray(target);
  let cloneTarget = isArray ? [] : {};

  if (map.get(target)) {
      return map.get(target);
  }
  map.set(target, cloneTarget);

  const keys = isArray ? undefined : Object.keys(target);
  forEach(keys || target, (value, key) => {
     // 如果 target 是对象，forEach 迭代的是对象的所有 key，
     //   所以回调的 value 就是key
      if (keys) {
          key = value;
      }
      cloneTarget[key] = clone2(target[key], map);
  });

  return cloneTarget;
}
```

#### :woman_technologist::technologist: 完整版 — 支持循环引用、正则、日期

Q1: 如何解决循环引用问题？   
可以额外开辟一个存储空间，来存储当前对象和拷贝对象的对应关系，当需要拷贝当前对象时，先去存储空间中找，有没有拷贝过这个对象，如果有的话直接返回，如果没有的话继续拷贝，这样就巧妙化解的循环引用的问题。

```javascript
// 获取数据类型
// 与 typeof 大致一致，并修正 null 为 null
function _typeof(obj) {
    return Object.prototype.toString.call(obj)
        .replace(/\[\w+\s(.*)\]/, '$1')
        .toLowerCase()
}

_typeof(() => {})// —>   'function'
_typeof(Symbol())// —>   'symbol'
_typeof([])// —>   'array'
_typeof({})// —>   'object'
_typeof(true)//  —>   'boolean'
_typeof(1)//  —>   'number'
_typeof('a')//  —>   'string'
_typeof(null)//  —>   'null'
_typeof(undefined)//  —>   'undefined'
```

[deepClone](./deepClone.js) 源码

```javascript
const iterableTypes = new Set(["object", "array", "map", "set"]);
// const notIterableTypes = new Set([
//   "boolean",
//   "date",
//   "number",
//   "string",
//   "symbol",
//   "error",
//   "regexp",
//   "function",
// ]);

function _typeof(value) {
  return Object.prototype.toString
    .call(value)
    .replace(/\[\w+\s(.*)\]/, "$1")
    .toLowerCase();
}

function forEach (array, iteratee) {
  let index = -1
  const length = array.length

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) { // 手动返回 false break 掉 forEeach
      break
    }
  }
  return array
}

function isObject (value) {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

const symbolValueOf = Symbol.prototype.valueOf
function cloneSymbol (symbol) {
  return Object(symbolValueOf.call(symbol))
}

function cloneRegExp (regexp) {
  const reFlags = /\w*$/
  const result = new regexp.constructor(regexp.source, reFlags.exec(regexp))
  result.lastIndex = regexp.lastIndex
  return result
}

function cloneNotIterableType(target) {
  const constrFun = target.constructor;
  switch (_typeof(target)) {
      case "boolean":
      case "number":
      case "string":
      case "error":
      case "date":
          return new constrFun(target);
      case "regexp":
          return cloneRegExp(target);
      case "symbol":
          return cloneSymbol(target);
      case "function":
          return target;
      default:
          return null;
  }
}

function deepClone(target, map = new WeakMap()) {

  // clone primitive types
  if (!isObject(target)) {
      return target;
  }

  const type = _typeof(target);
  let cloneTarget = null;

  if (map.get(target)) {
      return map.get(target);
  }
  map.set(target, cloneTarget);

  if (!iterableTypes.has(type)) {
      return cloneNotIterableType(target)
  }

  // clone Set
  if (type === "set") {
      cloneTarget = new Set();
      target.forEach(value => {
          cloneTarget.add(deepClone(value, map));
      });
      return cloneTarget;
  }

  // clone Map
  if (type == "map") {
      cloneTarget = new Map();
      target.forEach((value, key) => {
          cloneTarget.set(key, deepClone(value, map));
      });
      return cloneTarget;
  }

  // clone Array
  if (type == "array") {
      cloneTarget = new Array();
      forEach(target, (value, index) => {
        cloneTarget[index] = deepClone(value, map);
      })
  }

  // clone normal Object
  if (type == "object") {
      cloneTarget = new Object();
      forEach(Object.keys(target), (key, index) => {
        cloneTarget[key] = deepClone(target[key], map);
      })
  }

  return cloneTarget;
}
```

### 参考：  

- [30 seconds of code](https://www.30secondsofcode.org/js/s/deep-clone)
- [如何写出一个惊艳面试官的深拷贝? — ConardLi](https://juejin.cn/post/6844903929705136141)
- [Write a Better Deep Clone Function in JavaScript — bytefish](https://javascript.plainenglish.io/write-a-better-deep-clone-function-in-javascript-d0e798e5f550)