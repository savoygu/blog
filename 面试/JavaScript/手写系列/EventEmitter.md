## 实现 EventEmitter 

[EventEmitter](./EventEmitter.js) 源码

### 代码实现

#### :woman_technologist::technologist: 简单版

```javascript
class EventEmitter {
  constructor() {
    this.listeners = new Map()
  }

  /**
   * 为指定事件注册一个监听器，接受一个字符串 event 和一个回调函数。
   * @param {String} event 事件名
   * @param {Function} listener 事件处理函数
   */
  on(event, listener) { // { before: listener, after: listener }
    const listeners = this.listeners
    if (!listeners.has(event)) {
      listeners.set(event, [])
    }

    listeners.get(event).push(listener)
  }

  /**
   * 按监听器的顺序执行执行每个监听器
   * @param {String} event 事件名
   * @param  {...any} args 参数列表
   * @returns 
   */
  emit(event, ...args) {
    const listeners = this.listeners
    if (!listeners.has(event)) return

    const handlers = listeners.get(event)
    handlers.forEach((handler) => {
      handler.apply(this, args)
    })
  }

  /**
   *  移除指定事件的某个监听回调
   * @param {String} event 事件名
   * @param {Function} listener 事件处理函数
   * @returns 
   */
  off(event, listener) {
    const listeners = this.listeners
    if (!listeners.has(event)) return

    if (!listener) {
      listeners.delete(event)
    } else {
      const handlers = listeners.get(event)
      const index = handlers.indexOf(listener)
      if (index > -1) handlers.splice(index, 1)
    }
  }
}
```

#### :woman_technologist::technologist: mitt

[mitt — developit](https://github.com/developit/mitt)

```javascript
// https://github.com/developit/mitt
function mitt(all) {
  all = all || new Map()
  return {
    all, 
    on(type, handler) {
      const handlers = all.get(type)
      const added = handlers && handlers.push(handler)
      if (!added) { // 事件名为 type 的 handlers 不存在 
        all.set(type, [handler])
      }
    },
    off(type, handler) {
      const handlers = all.get(type)
      if (handlers) {
        //  如果 handler 不存在时，-1 >>> 0 为 4294967295
        handlers.splice(handlers.indexOf(handler) >>> 0, 1)
      }
    },
    emit(type, evt) {
      ;(all.get(type) || []).slice().map(handler => { handler(evt) })
      ;(all.get('*') || []).slice().map(handler => { handler(type, evt) })
    }
  }
}
```

#### :woman_technologist::technologist: 完整版

```javascript
class EventEmitter {
  constructor() {
    this._listeners = new Map()
    this.maxListener = 10
  }

  // 为指定事件注册一个监听器，接受一个字符串 event 和一个回调函数。
  on(event, listener) {
    const handlers = this._listeners.get(event)
    if (handlers && handlers.length > this.maxListener) {
      throw console.error('监听器的最大数量是%d, 您已超出限制!', this.maxListener)
    }

    const added = handlers && handlers.push(listener)
    if (!added) {
      this._listeners.set(event, [listener])
    }
  }

  // 按监听器的顺序执行执行每个监听器
  emit(event, ...args) {
    ;(this._listeners.get(event) || []).forEach(handler => handler(null, args))
  }

  // on的同名函数（alias）
  addListener(event, listener) {
    return this.on(event, listener)
  }

  // 和on类似，但只触发一次，随后便解除事件监听
  once(event, listener) {
    const that = this
    function handler (...args) {
      listener.apply(null, args)
      that.removeListener(event, handler)
    }
    
    this.on(event, handler)
  }
  
  // 移除指定事件的某个监听回调
  removeListener(event, listener) {
    const handlers = this._listeners.get(event)
    if (handlers) {
      handlers.splice(handlers.indexOf(listener) >>> 0, 1)
    }
  }

  // 移除指定事件的所有监听回调
  removeAllListeners(event) {
    this._listeners.set(event, [])
  }

  // 用于提高监听器的默认限制的数量。（默认10监听回调个产生警告
  setMaxListeners(n) {
    this.maxListener = n
  }

  // 返回指定事件的监听器数组。
  listeners(event) {
    return this._listeners.get(event)
  }
}
```

### 参考：  

- [mitt — developit](https://github.com/developit/mitt)
- [EventEmitter的前端实现 — 落落](https://zhuanlan.zhihu.com/p/77876876)
