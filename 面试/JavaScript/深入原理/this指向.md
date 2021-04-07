## this 指向

### 核心两要素

- this 的指向不是在函数定义时确定的，而是在函数调用时确定
- this 默认情况下指向 window，严格模式下为 undefined

### this 指向分类

#### :one: 隐世绑定

:star: **重点**: this 指向距离其**最近的调用者**

所谓的**最近的调用者**就函数前面最近的一个对象。

```
function test() {
  console.log(this)
}

var obj = {
  name: 'Mike',
  test: function () {
    console.log(this)    
  }
}

test() // 输出:  window
obj.test() // 输出: obj { name: 'Mike', test: f () }
```

####  :two: 显式绑定

在 JavaScript 中，call, apply, bind 可以修改 this 的指向: 

1. 函数调用 call, apply, bind 后，绑定的 this 会指向传入的第一个参数  
2. 如果函数调用 call, apply, bind 时没有传入参数，则指向默认对象 window(或 undefined)

```javascript
function test() {
  console.log(this)
}

var obj = {
  name: 'Mike'
}

test.call(obj) // obj { name: 'Mike' }
test.apply() // window
test.bind(obj)() // obj { name: 'Mike' }
```

#### :three: 构造函数中的 this

```javascript
// 构造函数的 this
function test() {
  this.name = 'Rose'
  console.log(this)
}

// 返回一个对象类型
function testObj() {
  this.name = 'Rose'
  return { name: 'Jack' }
}

// 返回一个基本类型
function testBasic() {
  this.name = 'Rose'
  return 3
}

new test() // 输出: test {name: "Rose"}

console.log(new test()) // 输出: test {name: "Rose"}
console.log(new testObj()) // 输出: {name: "Jack"}
console.log(new testBasic()) // 输出: testBasic {name: "Rose"}
```

:star: **重点**: 构造函数中的this指向该函数创建的实例对象

:star::star::star: 拓展：

如果该构造函数返回一个对象类型(如`Object`, `Array`, `Function`, `Symbol`,  `null` 除外)，则通过`new` 关键字创建的实例指向其返回值，否则返回该构造函数创建的实例对象。

#### :four: 箭头函数中的 this

> 摘自 MDN — 箭头函数

不只有箭头函数中的 this 指向，更是对箭头函数的总结！！！

> MDN: **箭头函数表达式**的语法比**函数表达式**更简洁，并且没有自己的 `this`，`arguments`，`super` 或 `new.target`。箭头函数表达式更适用于那些本来需要匿名函数的地方，并且它不能用作构造函数。

> 引入箭头函数有两个方面的作用：更简短的函数并且不绑定this。  

> **没有单独的this**：在箭头函数出现之前，每一个新函数根据它是被如何调用的来定义这个函数的this值：
> 
> - 如果是该函数是一个构造函数，`this` 指针指向一个新的对象
> - 在严格模式下的函数调用下，`this` 指向undefined
> - 如果是该函数是一个对象的方法，则它的 `this` 指针指向这个对象
> - 等等

:star::star::star: **重点**: 箭头函数不会创建自己的 `this`,它只会从自己的作用域链的上一层继承 `this`。

:star: **与严格模式的关系**:
> 鉴于 this 是词法层面上的，严格模式中与 `this` 相关的规则都将被忽略。

```javascript
function foo() {
  var f = () => { 'use strict'; return this; };
  var g = function () { 'use strict'; return this }
  console.log(this) // window 或者 global
  console.log(f() === window); // 或者 global，输出 true，箭头函数 f 不受严格模式影响
  console.log(g() === window); // 或者 global，输出 false，因为严格模式下 函数 g 的 this 为 undefined
}
foo()
```

严格模式的其他规则依然不变.

:star: **通过 `call` 或 `apply` 调用**: 

> 由于 `箭头函数没有自己的this指针`，通过 `call()` 或 `apply()` 方法调用一个函数时，只能传递参数（不能绑定`this`---译者注），他们的第一个参数会被忽略。（这种现象对于 `bind` 方法同样成立---译者注）

```javascript
var adder = {
  base : 1,

  add : function(a) {
    var f = v => v + this.base;
    return f(a);
  },

  addThruCall: function(a) {
    var f = v => v + this.base;
    var b = {
      base : 2
    };

    return f.call(b, a);
  }
};

console.log(adder.add(1));         // 输出 2
console.log(adder.addThruCall(1)); // 仍然输出 2，说明 箭头函数的 call 的第一个参数被忽略了
```

:star: **不绑定`arguments`**:
> 箭头函数不绑定`Arguments` 对象。因此，在本示例中，`arguments`只是引用了封闭作用域内的`arguments`：

```javascript
var arguments = [1, 2, 3];
var arr = () => arguments[0];

arr(); // 1

function foo(n) {
  var f = () => arguments[0] + n; // 隐式绑定 foo 函数的 arguments 对象. arguments[0] 是 n,即传给foo函数的第一个参数
  return f();
}

foo(1); // 1 + 1  => 2
foo(2); // 2+ 2 =>  4
foo(3); // 3+ 3 =>  6
foo(3,2);// 4 + 4  =>  6
```

在大多数情况下，使用 `剩余参数` 是相较使用 `arguments` 对象的更好选择。

```javascript
function foo(arg) {
  var f = (...args) => args[0];
  return f(arg);
}
foo(1); // 1

function foo(arg1,arg2) {
    var f = (...args) => args[1];
    return f(arg1,arg2);
}
foo(1,2);  //2
```

:star: **使用箭头函数作为方法**

```javascript
'use strict';
var obj = {
  i: 10,
  b: () => console.log(this.i, this),
  c: function() {
    console.log( this.i, this)
  }
}
obj.b(); // undefined, Window{...}
obj.c(); // 10, Object {...}
```

```javascript
'use strict';
var obj = {
  a: 10
};

Object.defineProperty(obj, "b", {
  get: () => {
    console.log(this.a, typeof this.a, this);
    return this.a+10;
   // 代表全局对象 'Window', 因此 'this.a' 返回 'undefined'
  }
});

obj.b; // undefined   "undefined"   Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
```

结论：箭头函数没有定义this绑定。

:star: **使用 new 操作符**

箭头函数不能用作构造器，和 new一起用会抛出错误。

```javascript
var Foo = () => {};
var foo = new Foo(); // TypeError: Foo is not a constructor
```

:star: **使用prototype属性**

箭头函数没有prototype属性。

```javascript
var Foo = () => {};
console.log(Foo.prototype); // undefined
```

:star: **使用 yield 关键字**

`yield` 关键字通常不能在箭头函数中使用（除非是嵌套在允许使用的函数内）。因此，箭头函数不能用作函数生成器。

:star::star::star: 综上所述：

- 箭头函数本身不会创建 `this`，只会从上级作用域(作用域链)继承 `this` 
- 箭头函数的严格模式下，对于this 相关的规则会被忽略，也就是说不会影响其继承上级作用域的 `this`。
- 箭头函数不能作为 构造函数，也就是不能与 new 一起使用。
- 箭头函数调用 `bind`、`call`、`apply` 时，传入的 `this` 会被忽略。
- 箭头函数没有 原型 `prototype` 属性。
- 箭头函数没有绑定 arguments，如果在其中使用的话，则是来自上级作用域(函数作用域)的。

#### :five:立即执行函数中的 this

立即执行函数中的 `this` 就一句话：`永远指向全局 window`

#### :six: DOM 事件处理函数中的 this

> 摘自 MDN — this

当函数被用作事件处理函数时，它的 this 指向触发事件的元素（一些浏览器在使用非 addEventListener 的函数动态地添加监听函数时不遵守这个约定）。

```javascript
// 被调用时，将关联的元素变成蓝色
function bluify(e){
  console.log(this === e.currentTarget); // 总是 true

  // 当 currentTarget 和 target 是同一个对象时为 true
  console.log(this === e.target);
  this.style.backgroundColor = '#A5D9F3';
}

// 获取文档中的所有元素的列表
var elements = document.getElementsByTagName('*');

// 将bluify作为元素的点击监听函数，当元素被点击时，就会变成蓝色
for(var i=0 ; i<elements.length ; i++){
  elements[i].addEventListener('click', bluify, false);
}
```

#### :seven: 内联事件处理函数中的 this

> 摘自 MDN — this

[代码](https://codepen.io/savoygu/pen/jOyaxoo)

当代码被内联 [on-event 处理函数](https://developer.mozilla.org/zh-CN/docs/Web/Guide/Events/Event_handlers) 调用时，它的 `this` 指向监听器所在的DOM元素：

```javascript
<button onclick="alert(this.tagName.toLowerCase());">
  Show this
</button>
```

上面的 `alert` 会显示 `button`。注意只有外层代码中的 `this` 是这样设置的：

```javascript
<button onclick="alert((function(){return this})());">
  Show inner this
</button>
```

在这种情况下，没有设置内部函数的 `this`，所以它指向 `global/window` 对象（即非严格模式下调用的函数未设置 `this` 时指向的默认对象）。


### this 的设计缺陷及其应对方案


### 参考

- [this - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)
- [箭头函数 — MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [this指向问题 — 前端橘子君](https://juejin.cn/post/6894163510088744973)
- [JS执行机制](https://zhuanlan.zhihu.com/p/151033665)