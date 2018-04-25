# 致姗姗来迟的 Sass

## 认知篇『接触了解』

### Sass VS SCSS

有两种语法可供「Sass」（这里指的是Sass 预处理器）使用：

- 一种是『Sass』(Syntactically Awesome StyleSheets 的简称)，使用[缩进语法](https://sass-lang.com/documentation/file.INDENTED_SYNTAX.html#Sass_Syntax_Differences)；
- 一种是『SCSS』(Sassy CSS 的简称)，使用基于CSS的语法。

#### 优劣

『Sass』

- 简洁：不需要分号和花括号，可以使用 `=` 和 `+` 代替 `@mixin` 和 `@include`；

『SCSS』

- 可读性「强」：语法与 CSS 非常相似；
- 学习曲线「低」：只是在 CSS 基础上添加了一些特性；
- 兼容性「好」：一个 CSS 文件也是一个合法的 SCSS 文件；
- 资源「多」：大量在线的文章可以阅读和开源代码库可供使用；
- 扩展性「高」：从 SCSS 转换到 Sass 非常容易；

#### 形式上

『Sass』使用「缩进」代替花括号「{」 和 「}」，使用「换行」代替分号「;」

```scss
.container
  width: 1200px
  margin: 0 auto
```

『SCSS』使用花括号「{」和「}」和分号「;」

```scss
.container {
  width: 1200px
  margin: 0 auto
}
```

#### 语法上

##### 属性

『Sass』有两种声明属性的方式：

- 一种是类似于CSS，只是没有分号
- 一种是把冒号放到属性的前面，属性名和属性值用空格分开

第一种：

```scss
.container
  width: 1200px
  margin: 0 auto
```

第二种：

```scss
.container
  :width 1200px
  :margin 0 auto
```

『SCSS』声明属性与 CSS 一致。

##### 注释

『Sass』中注释是基于行的，要么是一整行，要么是换行嵌套，与『SCSS』一样，『Sass』支持两种注释，一种是以 `/*` 开始，不需要以 `*/` 结尾，编译成 CSS 时，会一块输出， 一种是 `//`，不会随 CSS 输出。

```sass
/* 一整行——这些注释会出现在输出的 CSS中
.container
  width: 1200px
  margin: 0 auto
```

```sass
/* 换行嵌套——这些注释会出现在输出的 CSS中
  这些是嵌套在注释下面
.container
  width: 1200px
  margin: 0 auto
```

『SCSS』支持三种注释，一种是多行注释 `/* */`，一种是单行注释 `//`

```scss
/* 这些注释会出现在输出的 CSS中
  这些不用嵌套在注释下面*/
.container {
  width: 1200px
  margin: 0 auto
}
```

```scss
// 这些注释不会出现在输出的 CSS中
// 这些不用嵌套在注释下面
.container {
  width: 1200px
  margin: 0 auto
}
```

##### @import

『Sass』 中可以不使用引号，当然也可以使用

```scss
@import theme.sass
@import font.sass
```

『SCSS』必须使用引号

```scss
@import "theme.sass"
@import "font.sass"
```

##### Mixin 指令

『Sass』支持对 `@mixin` 和 `@include` 的简写，使用等于号 `=` 代替 `@mixin`，使用加号 `+` 代替 `@include`

```scss
=wrap
  width: 1200px
  margin: 0 auto

.container
  +wrap
```

等同于

```scss
@mixin wrap
  width: 1200px
  margin: 0 auto

.container
  @include wrap
```

『SCSS』只支持 `@mixin` 和 `@include`

#### Sass 与 SCSS 相互转换

```bash
sass-convert global.scss global.sass
sass-convert global.sass global.scss
```

使用 `sass-convert --help` 获取更多使用方式。

参考资料：

[https://stackoverflow.com/questions/5654447/whats-the-difference-between-scss-and-sass](https://stackoverflow.com/questions/5654447/whats-the-difference-between-scss-and-sass) 『stackoverflow』

[http://sass-lang.com/documentation/file.SASS_REFERENCE.html#syntax](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#syntax) 『Sass 文档』

[https://sass-lang.com/documentation/file.INDENTED_SYNTAX.html#Sass_Syntax_Differences](https://sass-lang.com/documentation/file.INDENTED_SYNTAX.html#Sass_Syntax_Differences)『Sass 文档——缩进语法』

## 语法篇『搞懂明白』

## 进阶篇『熟练掌握』

## 实战篇『灵活运用』

[http://chriseppstein.github.io/blog/2010/05/25/refactor-my-stylesheets-digg-edition/](http://chriseppstein.github.io/blog/2010/05/25/refactor-my-stylesheets-digg-edition/)
