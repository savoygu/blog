## 实现 Promise 

### 代码实现

```javascript
const PENDING = Symbol("pending");
const FULFILLED = Symbol("fulfilled");
const REJECTED = Symbol("rejected");

class Promise3 {
  status = PENDING;
  value = null;
  reason = null;
  onFulfilledCallbacks = []; // 存储异步场景下，成功的回调，参见 “场景示例 1”
  onRejectedCallbacks = []; // 存储异步场景下，失败的回调

  constructor(executor) {
    try {
      executor(this._resolve, this._reject);
    } catch (err) {
      this._reject(err);
    }
  }

  // 这里 _resolve 和 _reject 使用 箭头函数的 原因是：在 实例化 Promise 时，
  //  直接调用 `resolve()` 或 `reject()`，
  //    如果果不使用箭头函数，会使 this 指向 window 或者 undefined，
  //    而使用箭头函数，可以让 this 指向当前实例对象

  // 更改成功后的状态，只处理 PENDING 状态，状态由 PENDING 转变为 FULFILLED
  _resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;

      // 场景：异步调用 resolve 时，由于是异步是宏任务，会后于微任务 then 的执行，
      //  为了保证 then 的执行顺序，使用 onFulfilledCallbacks 顺序保存每个 then 的 onFulfilled，
      //  当 `resolve` 执行后，再执行 then 的 onFulfilled 回调
      this.onFulfilledCallbacks.forEach((callback) => { // 处理异步时，调用每个 then 的 onFulfilled
        callback(value);
      });
    }
  };
  // 更改失败后的状态，只处理 PENDING 状态，状态由 PENDING 转变为 REJECTED
  _reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;

      // 场景：异步调用 reject 时，由于是异步宏任务，会后于微任务 then 的执行，
      //  为了保证 then 的执行顺序，使用 onRejectedCallbacks 顺序保存每个 then 的 onRejected，
      //  当 `reject` 执行后，再执行 then 的 onRejected 回调
      this.onRejectedCallbacks.forEach((callback) => {
        callback(reason);
      });
    }
  };

  then(onFulfilled, onRejected) {
    // 值穿透，参见 “场景示例 3”
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    // then 返回 Promise3 是为了支持 链式调用，参见 “场景示例 2”
    let promise2 = new Promise3((resolve, reject) => {
      if (this.status === FULFILLED) {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      } else if (this.status === REJECTED) {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      } else if (this.status === PENDING) {
         // 异步场景下 — 存储成功或失败回调，等到异步结束 resolve 或 reject 执行时，再顺序调用
        this.onFulfilledCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          });
        });
      }
    });
    return promise2;
  }

  static resolve(value) { // Promise.resolve()
    if (value instanceof Promise3) return value;
    return new Promise3((resolve) => {
      resolve(value);
    });
  }

  static reject(reason) { // Promise.reject()
    return new Promise3((_, reject) => {
      reject(reason);
    });
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
        return new Promise3((resolve, reject) => {
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
  if (promise2 === x) { // 参见 “场景示例 4”
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }

  // 如果 then 的 onFulfilled 回调返回的是 Promise，
  //  那么 then 中的 Promise2 状态更改取决于返回的 Promise
  // if (x instanceof Promise3) {
  //   x.then(resolve, reject);
  // } else {
  //   // 如果不是 Promise，then中的 promise 状态它自己决定
  //   resolve(x);
  // }

  let called = false;
  if ((x !== null && typeof x === "object") || typeof x === "function") {
    try {
      const then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (err) => {
            if (called) return;
            called = true;
            reject(err);
          }
        );
      } else { 
        // 如果 then 不是函数，以 x 为参数执行 promise
        resolve(x);
      }
    } catch (err) {
      if (called) return;
      reject(err);
    }
  } else {
  // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x);
  }
}

Promise3.deferred = function () {
  const dfd = {};
  dfd.promise = new Promise3(function (resolve, reject) {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });

  return dfd;
};

module.exports = Promise3;
```

#### **验证 Promise3 实现的正确性**

下载 [Promise3](./Promise3.js) 源码，直接运行下面的命令：

```bash
npx promises-aplus-tests Promise3.js
```

跑通所有测试，证明实现正确

### 场景示例 — 演示代码的解决场景

:chestnut: 场景示例 1 — 异步调用时，保证 then 回调的顺序执行

```javascript
const p3 = new Promise3((resolve, reject) => {
  setTimeout(() => {
    resolve('hello')
  }, 2000)
})

p3.then((value) => {
  console.log(value + ' world!');
})

.then(value => {
  console.log(value + ' js!');
})

.then((value) => {
  console.log(value + ' fe!');
})

// 输出 
// 'hello world!'
// 'hello js!'
// 'hello fe!'
```

:chestnut: 场景示例 2 — 链式调用，保存上个 then 返回的状态

```javascript
const p3 = new Promise3((resolve, reject) => {
  resolve()
})

p3.then(() => {
  return 'hello'
}).then(value => {
  return value + ' world!'
}).then((value) => {
  console.log(value)
})

// 输出 'hello world!'
```

:chestnut: 场景示例 3 — 值穿透

```javascript
const p3 = new Promise3((resolve, reject) => {
  resolve('hello')
})

p3.then()
  .then()
  .then((value) => {
    console.log(value)
  })

// 输出 'hello'
```

:chestnut: 场景示例 4 — 循环引用

```javascript
const p3 = new Promise3((resolve, reject) => {
  setTimeout(() => {
    resolve('hello')
  }, 2000)
})

const p1 = p3.then(value => {
  console.log(value)
  return p1
})

p1.then(value => {
  console.log(value)
}, err => {
  console.log(err)
})

// 输出 'hello'
// 抛出 循环引用错误
```

### Promises/A+ 规范

1. 术语

   1.1 promise 是一个拥有 then 方法的对象或函数，其行为符合本规范；  
   1.2 thenable 是一个拥有 then 方法和对象或者函数；  
   1.3 value 指任何 JavaScript 的合法值（包括 undefined，thenable 和 promise）；  
   1.4 exception 是使用 throw 语句抛出的一个值；  
   1.5 reason 表示一个 promise 的拒绝原因；  

2. 要求

   2.1 Promise 状态  
      一个 Promise 的当前状态必须为以下三种状态中的一种：等待态（pending）、执行态（fulfilled）和拒绝态（rejected）。  
      - 2.1.1 处于 pending 时，promise 可以迁移至 fulfilled 或 rejected。  
      - 2.1.2 处于 fulfilled 时，不能迁移到其它状态，必须拥有一个不可变的 value。  
      - 2.1.3 处于 rejected 时，不能迁移到其它状态，必须拥有一个不可变的 reason。

   2.2 Then 方法  
     一个 promise 必须提供一个 then 方法以访问其当前值、终值和据因。  
     promise 的 then 方法接受两个参数：  
      - promise.then(onFulfilled, onRejected)

     2.2.1 onFulfilled 和 onRejected 都是可选参数  
      - 2.2.1.1 如果 onFulfilled 不是函数，其必须被忽略  
      - 2.2.1.2 如果 onRejected 不是函数，其必须被忽略

     2.2.2 如果 onFulfilled 是函数：  
      - 2.2.2.1 当 promise 执行结束后其必须被调用，其第一个参数为 promise 的终值  
      - 2.2.2.2 在 promise 执行结束前其不可被调用  
      - 2.2.2.3 其调用次数不可超过一次  

     2.2.3 如果 onRejected 是函数：  
      - 2.2.3.1 当 promise 被拒绝执行后其必须被调用，其第一个参数为 promise 的据因  
      - 2.2.3.2 在 promise 被拒绝执行前其不可被调用  
      - 2.2.3.3 其调用次数不可超过一次  

     2.2.4 调用时机  
       onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用 (注1)

     2.2.5 调用要求  
       onFulfilled 和 onRejected 必须被作为函数调用（即没有 this 值） (注2)

     2.2.6 多次调用  
       then 方法可以被同一个 promise 调用多次

      - 2.2.6.1 当 promise 成功执行时，所有 onFulfilled 需按照其注册顺序依次回调
      - 2.2.6.2 当 promise 被拒绝执行时，所有的 onRejected 需按照其注册顺序依次回调

     2.2.7 返回  
       then 方法必须返回一个 promise 对象 (注3)  
         promise2 = promise1.then(onFulfilled, onRejected);

      - 2.2.7.1 如果 onFulfilled 或者 onRejected 返回一个值 x ，
         则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)
      - 2.2.7.2 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，
         则 promise2 必须拒绝执行，并返回拒因 e
      - 2.2.7.3 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
      - 2.2.7.4 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因

      译者注：理解上面的“返回”部分非常重要，即：不论 promise1 被 reject 还是被 resolve 时 promise2  
        都会被 resolve，只有出现异常时才会被 rejected。

   2.3 Promise 解决过程  
     - Promise 解决过程是一个抽象的操作，其需输入一个 promise 和一个值，我们表示为 [[Resolve]](promise, x)，  
      如果 x 有 then 方法且看上去像一个 Promise ，解决程序即尝试使 promise 接受 x 的状态；否则其用 x 的值来执行 promise 。

     - 这种 thenable 的特性使得 Promise 的实现更具有通用性：只要其暴露出一个遵循 Promise/A+ 协议的 then 方法即可；  
      这同时也使遵循 Promise/A+ 规范的实现可以与那些不太规范但可用的实现能良好共存。

     运行 [[Resolve]](promise, x) 需遵循以下步骤：  

     2.3.1 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise  

     2.3.2 如果 x 为 Promise ，则使 promise 接受 x 的状态 (注4)：  
      - 2.3.2.1 如果 x 处于等待态， promise 需保持为等待态直至 x 被执行或拒绝
      - 2.3.2.2 如果 x 处于执行态，用相同的值执行 promise
      - 2.3.2.3 如果 x 处于拒绝态，用相同的据因拒绝 promise

     2.3.3 如果 x 为对象或者函数： 
      - 2.3.3.1 把 x.then 赋值给 then (注5)
      - 2.3.3.2 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      - 2.3.3.3 如果 then 是函数，将 x 作为函数的作用域 this 调用之。传递两个回调函数作为参数，  
         第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise:
        - 2.3.3.3.1 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
        - 2.3.3.3.2 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
        - 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
        - 2.3.3.3.4 如果调用 then 方法抛出了异常 e：
          - 2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
          - 2.3.3.3.4.2 否则以 e 为据因拒绝 promise
      - 2.3.3.4 如果 then 不是函数，以 x 为参数执行 promise  

    2.3.4 如果 x 不为对象或者函数，以 x 为参数执行 promise

     - 如果一个 promise 被一个循环的 thenable 链中的对象解决，而 [[Resolve]](promise, thenable) 的递归性质又使得其被再次调用，
      根据上述的算法将会陷入无限递归之中。算法虽不强制要求，但也鼓励施者检测这样的递归是否存在，若检测到存在则以一个可识别的 TypeError
       为据因来拒绝 promise (注6)

注释  
  - 注1：这里的平台代码指的是引擎、环境以及 promise 的实施代码。实践中要确保 onFulfilled 和 onRejected 方法异步执行，
      且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。这个事件队列可以采用“宏任务（macro-task）”机制或者“微任务
      （micro-task）”机制来实现。由于 promise 的实施代码本身就是平台代码（译者注：即都是 JavaScript），故代码自身在处理在处理程序时
      可能已经包含一个任务调度队列。  
     - 译者注：这里提及了 macrotask 和 microtask 两个概念，这表示异步任务的两种分类。在挂起任务时，JS 引擎会将所有任务按照类别分到这
        两个队列中，首先在 macrotask 的队列（这个队列也被叫做 task queue）中取出第一个任务，执行完毕后取出 microtask 队列中的
        所有任务顺序执行；之后再取 macrotask 任务，周而复始，直至两个队列的任务都取完。

        两个类别的具体分类如下：
          - macro-task: script（整体代码）, setTimeout, setInterval, setImmediate, I/O, UI rendering
          - micro-task: process.nextTick, Promises（这里指浏览器实现的原生 Promise）, Object.observe, MutationObserver

  - 注2： 也就是说在严格模式（strict）中，函数 this 的值为 undefined ；在非严格模式中其为全局对象。

  - 注3：代码实现在满足所有要求的情况下可以允许 promise2 === promise1 。每个实现都要文档说明其是否允许以及在何种条件下
      允许 promise2 === promise1 。

  - 注4： 总体来说，如果 x 符合当前实现，我们才认为它是真正的 promise 。这一规则允许那些特例实现接受符合已知要求的 Promises 状态。

  - 注5：这步我们先是存储了一个指向 x.then 的引用，然后测试并调用该引用，以避免多次访问 x.then 属性。这种预防措施确保了该属性的一致性，
      因为其值可能在检索调用时被改变。

  - 注6：实现不应该对 thenable 链的深度设限，并假定超出本限制的递归就是无限循环。只有真正的循环递归才应能导致 TypeError 异常；
      如果一条无限长的链上 thenable 均不相同，那么递归下去永远是正确的行为。


### 参考：  

- [从一道让我失眠的 Promise 面试题开始，深入分析 Promise 实现细节 — ITEM](https://juejin.cn/post/6945319439772434469)
- [BAT前端经典面试问题：史上最最最详细的手写Promise教程 — Carlus](https://juejin.cn/post/6844903625769091079)
- [剖析Promise内部结构，一步一步实现一个完整的、能通过所有Test case的Promise类](https://github.com/xieranmaya/blog/issues/3)
- [【翻译】Promises/A+规范](https://www.ituring.com.cn/article/66566)