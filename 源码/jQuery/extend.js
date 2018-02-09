/**
 * 扩展
 * extend.call(this, source)
 * extend(target, source2, source2)
 * extend(true/false, target, source1, source2, source3)
 */

var getPrototypeOf = Object.getPrototypeOf;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isPlainObject (obj) {
  var proto, Ctro;

  // 处理显而易见的情况
  if (!obj || toString.call(obj) !== '[object Object]') {
    return false;
  }

  // 处理 Object.create(null) 的情况
  proto = getPrototypeOf(obj);
  if (!proto) {
    return true;
  }

  Ctro = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctro === 'function' && Ctro.toString === Object.toString;
}

function isFunction (obj) {
  return typeof obj === 'function' && typeof obj.nodeType !== 'number';
}

function extend () {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // 处理深拷贝的情况
  if (typeof target === 'boolean') {
    deep = true;

    target = arguments[i] || {};
    i++;
  }

  if (typeof target !== 'object' && !isFunction(target)) {
    target = {};
  }

  // 只有一个参数的情况
  if (i === length) {
    target = this;
    i--;
  }

  for (; i < length; i++) {
    if ((options = arguments[i]) != null) {
      for (name in options) {
        src = target[name];
        copy = options[name];

        // 阻止无休止的循环
        if (target === copy) {
          continue;
        }

        // 处理嵌套对象的情况
        if (deep && copy && (isPlainObject(copy) ||
          (copyIsArray = Array.isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }

          target[name] = extend(deep, clone, copy);
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  return target;
}
