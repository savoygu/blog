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


// test
const map = new Map();
map.set('key', 'value');

const set = new Set();
set.add('value1');
set.add('value2');

const target = {
    field1: 1,
    field2: undefined,
    field3: {
        child: 'child'
    },
    field4: [2, 4, 8],
    empty: null,
    map,
    set,
    bool: new Boolean(true),
    num: new Number(2),
    str: new String(2),
    symbol: Object(Symbol(1)),
    date: new Date(),
    reg: /\d+/,
    error: new Error(),
    func1: () => {
        console.log('hello friend!');
    },
    func2: function (a, b) {
        return a + b;
    }
};

const result = deepClone(target);
console.log(result);
console.log(result.field3 === target.field3)
console.log(result.field4 === target.field4)
console.log(result.map === target.map)
console.log(result.num === target.num)
console.log(result.reg === target.reg)