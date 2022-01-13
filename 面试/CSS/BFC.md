## BFC

### FC

FC 的全称是：Formatting Contexts，是 W3C CSS2.1 规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。

### BFC 概述

BFC(Block Formatting Contexts)直译为"块级格式化上下文"。Block Formatting Contexts 就是页面上的一个隔离的渲染区域，容器里面的子元素不会在布局上影响到外面的元素，反之也是如此。

### 什么情况下会创建 BFC

- 根元素（`<html>`）
- 浮动元素（元素的 `float` 不是 `none`）
- 绝对定位元素（元素的 `position` 为 `absolute` 或 `fixed`）
- 行内块元素（元素的 `display` 为 `inline-block`）
- 表格单元格（元素的 `display` 为 `table-cell`，HTML 表格单元格默认为该值）
- 表格标题（元素的 `display` 为 `table-caption`，HTML 表格标题默认为该值）
- 匿名表格单元格元素（元素的 `display` 为 `table`、`table-row`、 `table-row-group`、`table-header-group`、`table-footer-group`（分别是 HTML table、table rows (<tr/>)、tbody、thead、tfoot 的默认属性）或 `inline-table`）
- `overflow` 计算值(Computed)不为 `visible` 的块元素
- `display` 值为 `flow-root` 的元素
- `contain` 值为 `layout`、`content` 或 `paint` 的元素
- 弹性元素（`display` 为 `flex` 或 `inline-flex` 元素的直接子元素）
- 网格元素（`display` 为 `grid` 或 `inline-grid` 元素的直接子元素）
- 多列容器（元素的 `column-count` 或 `column-width` (en-US) 不为 `auto`，包括 `column-count` 为 `1`）
- `column-span` 为 `all` 的元素始终会创建一个新的 BFC，即使该元素没有包裹在一个多列容器中

#### 扩展：`display: flow-root`

`display: flow-root` 可以让元素块状化，同时包含格式化上下文 BFC，可以用来清除浮动，去除 margin 合并，实现两栏自适应布局等。

### BFC 的渲染规则（BFC 特性）

- 块级盒子元素在垂直方向上，一个接一个地放置，每个盒子水平占满整个容器空间。
- 块级盒子元素的垂直方向距离由上下 margin 决定。属于同一个 BFC 的两个相邻元素的 margin 会发生重叠。
- BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
- 计算 BFC 高度时，浮动元素也参与计算。
- BFC 区域不会与 float 元素重叠。

#### 扩展：css2.1 盒模型规范（margin collapse）

所有毗邻的两个或更多盒元素的 margin 将会合并为一个 margin 共享之。毗邻的定义为：同级或者嵌套的盒元素，并且它们之间没有非空内容、Padding 或 Border 分隔。

#### 扩展：外边距重叠

- 两个相邻的外边距都是正数时，重叠结果是它们两者之间较大的值。
- 两个相邻的外边距都是负数时，重叠结果是两者绝对值的较大值。
- 两个外边距一正一负时，重叠结果是两者的相加的和。

### 应用场景

#### :one: 防止外边距合并

#### :two: 清除内部浮动

#### :three: 自适应两栏布局

利用规则：BFC 区域不会与 float 元素重叠

### 参考

- [css3 之 BFC、IFC、GFC 和 FFC](https://www.cnblogs.com/dingyufenglian/p/4845477.html)
- [子元素 margin-top 为何会影响父元素？](https://blog.csdn.net/sinat_27088253/article/details/52954688)
- [快速了解 CSS display:flow-root 声明](https://www.zhangxinxu.com/wordpress/2020/05/css-display-flow-root/)
- [格式化上下文](http://layout.imweb.io/article/formatting-context.html)
- [【CSS】BFC - 块级格式化上下文](https://segmentfault.com/a/1190000017163894)
- [CSS 格式化上下文](https://juejin.cn/post/6844903967084773390)
- [什么是 BFC？BFC 的规则是什么？如何创建 BFC？](https://github.com/YvetteLau/Step-By-Step/issues/15)
