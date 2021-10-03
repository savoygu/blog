const PENDING = Symbol('pending')
const FULFILLED = Symbol('fulfilled')
const REJECTED = Symbol('rejected')

class Promise3 {
  status = PENDING
  value = null
  reason = null
  onFulfilledCallbacks = []
  onRejectedCallbacks = []

  constructor(executor) {
    try {
      executor(this._resolve, this._reject)
    } catch (err) {
      this._reject(err)
    }
  }

  _resolve = (value) => {
    // 处理失败
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
      this.onFulfilledCallbacks.forEach((callback) => {
        callback(value)
      })
    }
  }

  _reject = (reason) => {
    // 处理失败
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason
      this.onRejectedCallbacks.forEach((callback) => {
        callback(reason)
      })
    }
  }

  then(onFulfilled, onRejected) {
    // 值穿透
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
          throw reason
        }

    let promise2 = new Promise3((resolve, reject) => {
      if (this.status === FULFILLED) {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      } else if (this.status === REJECTED) {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      } else if (this.status === PENDING) {
        // 处理异步调用 resolve 或 reject 时，无法传递value 给 then 的回调
        this.onFulfilledCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          })
        })
      }
    })
    return promise2
  }

  static resolve(value) {
    if (value instanceof Promise3) return value
    return new Promise3((resolve) => {
      resolve(value)
    })
  }

  static reject(reason) {
    return new Promise3((_, reject) => {
      reject(reason)
    })
  }

  catch(onRejected) { // p3.catch()
    return this.then(null, onRejected)
  }

  finally(fn) { // p3.finally()
    return this.then(value => {
      queueMicrotask(fn)
      return value
    }, err => {
      queueMicrotask(fn)
      throw err
    })
  }

  spread(fn, onRejected) { // p3.spread()
    return this.then(values => fn.apply(null, values), onRejected)
  }

  delay(duration) { // p3.delay()
    return this.then(
      value => {
        return new Promise3((resolve) => {
          setTimeout(() => {
            resolve(value)
          }, duration)
        })
      }, 
      err => {
        return new Promise3((resolve, reject) => {
          setTimeout(() => {
            reject(err)
          }, duration)
        })
      }
    )
  }

  static all(promises) { // Promise3.all()
    return new Promise3((resolve, reject) => {
      let resolvedCounter = 0
      const promiseNum = promises.length
      const resolvedValues = new Array(promiseNum)
      
      for (let i = 0; i < promiseNum; i++) {
        Promise3.resolve(promises[i]).then(value => {
          resolvedCounter++
          resolvedValues[i] = value
          if (resolvedCounter === promiseNum) {
            resolve(resolvedValues)
          }
        }, err => {
          reject(err)
        })
      }
    })
  }

  static race(promises) { // Promise3.race()
    return new Promise3((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        Promise3.resolve(promises[i]).then(value => resolve(value), err => reject(err))
      }
    })
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // 如果 then 的 onFulfilled 回调返回的是 then 创建的 Promise2
  //   导致后续的 then 的状态没法改变，因为 then 的状态取决于
  //    onFulfilled 返回的 Promise: promise2.then(resolve, reject)
  if (promise2 === x) {
    return reject(
      new TypeError('Chaining cycle detected for promise #<Promise>')
    )
  }

  // 如果 then 的 onFulfilled 回调返回的是 Promise，
  //  那么 then 中的 Promise2 状态更改取决于返回的 Promise
  // if (x instanceof Promise3) {
  //   x.then(resolve, reject)
  // } else {
  //   // 如果不是 Promise，then中的 promise 状态它自己决定
  //   resolve(x)
  // }

  let called = false
  if ((x !== null && typeof x === 'object') || typeof x === 'function') {
    try {
      const then = x.then
      if (typeof then === 'function') {
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          (err) => {
            if (called) return
            called = true
            reject(err)
          }
        )
      } else { 
        // 如果 then 不是函数，以 x 为参数执行 promise
        resolve(x)
      }
    } catch (err) {
      if (called) return
      reject(err)
    }
  } else {
  // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x)
  }
}

Promise3.deferred = function () {
  const dfd = {}
  dfd.promise = new Promise3(function (resolve, reject) {
    dfd.resolve = resolve
    dfd.reject = reject
  })

  return dfd
}

module.exports = Promise3



// 场景示例 1 — 异步调用时，保证 then 回调的顺序执行
// const p3 = new Promise3((resolve, reject) => {
//   setTimeout(() => {
//     resolve('hello')
//   }, 2000)
// })

// p3.then((value) => {
//   console.log(value + ' world!')
// })

// .then(value => {
//   console.log(value + ' js!')
// })

// .then((value) => {
//   console.log(value + ' fe!')
// })

// 场景示例 2 — 链式调用，保存上个 then 返回的状态
// const p3 = new Promise3((resolve, reject) => {
//   resolve()
// })

// p3.then(() => {
//   return 'hello'
// }).then(value => {
//   return value + ' world!'
// }).then((value) => {
//   console.log(value)
// })

// 场景示例 3 — 值穿透
// const p3 = new Promise3((resolve, reject) => {
//   resolve('hello')
// })

// p3.then().then().then((value) => {
//   console.log(value)
// })

// 场景示例 4 — 循环引用
// const p3 = new Promise3((resolve, reject) => {
//   setTimeout(() => {
//     resolve('hello')
//   }, 2000)
// })

// const p1 = p3.then(value => {
//   console.log(value)
//   return p1
// })

// p1.then(value => {
//   console.log(value)
// }, err => {
//   console.log(err)
// })