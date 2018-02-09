# 与 Promise 前世情缘

> 参考：[JavaScript Promise迷你书](http://liubin.org/promises-book/#race-delay-timeout)

阅读本文你能获得什么：

- Promise 基本概念
- Promise 编程接口
- Promise 应用场景

## 什么是 Promise

### Promise 概念

> Promise 是抽象异步处理对象以及对其进行各种操作的组件。——JavaScript Promise迷你书（中文版）
>
> Promise 对象用于一个异步操作的最终完成 fulfilled（或失败 rejected）及其结果的表示。（简单点说就是处理异步请求）—— MDN Promise

关键词：异步处理、异步操作、fulfilled、rejected

### Promise 工作流

```bash
```

### Promise 状态

用 `new Promise` 实例化 Promise 对象有以下三个状态：

- "has-resolution" - Fulfilled

resolve(成功)时。此时会调用 `onFulfilled`

- "has-rejection" - Rejected

reject(失败)时。此时会调用 `onRejected`

- "unresolved" - Pending

既不是 resolve 也不是 reject 的状态。也就是 promise 对象刚被创建后的初始化状态。

**说明：** 关于上面三种状态的读法，左侧为 ES6 Promise 规范中定义的术语，右侧是 Promises/A+ 中描述状态的术语。

![Promise 三种状态](前世情缘/promise-states.png)

## Promise 编程API

## Promise 优劣分析

优势：

可以将复杂的异步处理轻松的进行模块化。
