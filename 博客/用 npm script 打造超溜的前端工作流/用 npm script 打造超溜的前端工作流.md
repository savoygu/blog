# 用 npm script 打造超溜的前端工作流

> 如果您看到了，请支持作者[掘进小册](https://juejin.im/book/5a1212bc51882531ea64df07)

## 初级篇

### 1. 创建并运行 npm script 命令

#### 1.1 用 npm init 快速创建项目

执行 `npm init` 命令会询问几个基本问题，如包名称、版本号、作者信息、入口文件、仓库地址、许可协议等。

```bash
npm init
```

使用下面的命令可以修改 package.json 默认配置项：

```bash
npm config set init.author.email "savoygu@gmail.com"
npm config set init.author.name "savoygu"
npm config set init.author.url "http://github.com/savoygu"
npm config set init.license "MIT"
npm config set init.version "0.1.0"
```

如果想跳过询问直接生成 package.json 文件的话，可以加上 `-f|-y` 参数：

```bash
npm init [-f|--force|-y|--yes]
```

#### 1.2 用 npm run 执行任意命令

`npm run test` 可以简写为 `npm test` 或者 `npm t`

和 test 类似，start 也是 npm 内置支持的命令，但是需要先在 scripts 字段中声明该脚本的实际内容，如果没声明就执行 npm start，会直接报错。

执行 `npm run xxx` 时，基本步骤如下：

1. 从 package.json 文件中读取 scripts 对象里面的全部配置；
2. 以传给 npm run 的第一个参数作为键，本例中为 xxx，在 scripts 对象里面获取对应的值作为接下来要执行的命令，如果没找到直接报错；
3. 在系统默认的 shell 中执行上述命令，系统默认 shell 通常是 bash，windows 环境下可能略有不同，稍后再讲。

注意，上面这是简化的流程，更复杂的钩子机制后面章节单独介绍。

npm 在执行指定 script 之前会把 node_modules/.bin 加到环境变量 `$PATH` 的前面，这意味着任何内含可执行文件的 npm 依赖都可以在 npm script 中直接调用，换句话说，你不需要在 npm script 中加上可执行文件的完整路径，比如 `./node_modules/.bin/eslint **.js`。

#### 1.3 创建自定义 npm script

1. 准备被检查的代码

```bash
var name = 'savoygu'
var getName = function () {
	return name
}
```

2. 添加 eslint 依赖

```bash
npm install eslint --save-dev
```

3. 初始化 eslint 配置

```bash
./node_modules/.bin/eslint init
```

4. 添加 eslint 命令

```bash
{
	"scripts": {
		"eslint": "eslint *.js"
	}
}
```

5. 运行 eslint 命令

```bash
npm run eslint
```

### 2. 运行多个 npm script 的各种姿势

前端项目通常会包括多个 npm script，对多个命令进行编排是很自然的需求，有时候需要将多个命令串行，即脚本遵循严格的执行顺序；有时候则需要让它们并行来提高速度，比如不相互阻塞的 npm script。社区中也有比 npm 内置的多命令运行机制更好用的解决方案：npm-run-all。

#### 2.1 哪来那么多命令

通常来说，前端项目会包含 js、css、less、scss、json、markdown 等格式的文件，为保障代码质量，给不同的代码添加检查是很有必要的，代码检查不仅保障代码没有低级的语法错误，还可确保代码都遵守社区的最佳实践和一致的编码风格，在团队协作中尤其有用，即使是个人项目，加上代码检查，也会提高你的效率和质量。

通常会给前端项目加上下面 4 种代码检查：

- [eslint](https://eslint.org/)，可定制的 js 代码检查，1.1 中有详细的配置步骤；
- [stylelint](https://stylelint.io/)，可定制的样式文件检查，支持 css、less、scss；
- [jsonlint](https://github.com/zaach/jsonlint)，json 文件语法检查，踩过坑的同学会清楚，json 文件语法错误会知道导致各种失败；
- [markdownlint-cli](https://github.com/igorshubovych/markdownlint-cli)，Markdown 文件最佳实践检查，个人偏好；

此外，为代码添加必要的单元测试也是质量保障的重要手段，常用的单测技术栈是：

- [mocha](https://mochajs.org/)，测试用例组织，测试用例运行和结果收集的框架；
- [chai](http://www.chaijs.com/)，测试断言库，必要的时候可以结合 [sinon](http://sinonjs.org/) 使用；

```bash
{
  "name": "hello-npm-script",
  "version": "0.1.0",
  "main": "index.js",
  "scripts": {
    "lint:js": "eslint *.js",
    "lint:css": "stylelint *.less",
    "lint:json": "jsonlint --quiet *.json",
    "lint:markdown": "markdownlint --config .markdownlint.json *.md",
    "test": "mocha tests/"
  },
  "devDependencies": {
    "chai": "^4.1.2",
    "eslint": "^4.11.0",
    "jsonlint": "^1.6.2",
    "markdownlint-cli": "^0.5.0",
    "mocha": "^4.0.1",
    "stylelint": "^8.2.0",
    "stylelint-config-standard": "^17.0.0"
  }
}
```

#### 2.2 多个 npm script 串行

用 `&&` 符号把多条 npm script 按先后顺序串起来即可。

```bash
npm run lint:js && npm run lint:css && npm run lint:json && npm run lint:markdown && mocha tests/
```

需要注意的是，串行执行的时候如果前序命令失败（通常进程退出码非0），后续全部命令都会终止。

#### 2.3 多个 npm script 并行

在严格串行的情况下，我们必须要确保代码中没有编码规范问题才能运行测试，在某些时候可能并不是我们想要的，因为我们真正需要的是，代码变更时同时给出测试结果和测试运行结果。

从串行改成并行，实现方式更简单，把连接多条命令的 `&&` 符号替换成 `&` 即可。

```bash
npm run lint:js & npm run lint:css & npm run lint:json & npm run lint:markdown & mocha tests/
```

npm 内置支持的多条命令并行跟 js 里面同时发起多个异步请求非常类似，它只负责触发多条命令，而不管结果的收集，如果并行的命令执行时间差异非常大，会出现命令结果在进程退出之后才输出。

通过在命令的末尾增加 `& wait` 可保证在退出之前输出。

```bash
npm run lint:js & npm run lint:css & npm run lint:json & npm run lint:markdown & mocha tests/ & wait
```

加上 wait 的额外好处是，如果我们在任何子命令中启动了长时间运行的进程，比如启用了 mocha 的 `--watch` 配置，可以使用 `ctrl + c` 来结束进程，如果没加的话，你就没办法直接结束启动到后台的进程。

#### 2.4 更好的管理 npm script 的方式 —— npm-run-all

实现多命令的串行执行

```bash
npm-run-all lint:js lint:css lint:json lint:markdown mocha
```

npm-run-all 还支持通配符匹配分组的 npm script

```bash
npm-run-all lint:* mocha
```

多个 npm script 并行执行

```bash
npm-run-all --parallel lint:* mocha
```

### 3. 给 npm script 传递参数和添加注释

- 给 npm script 传递参数以减少重复的 npm script
- 增加注释提高 npm script 脚本的可读性
- 控制运行时日志输出能让你专注在重要信息上

#### 3.1 给 npm script 传递参数

eslint 内置了代码风格自动修复模式，只需给它传入 `--fix` 参数即可，在 scripts 中声明检查代码命令的同时你可能也需要声明修复代码的命令：

```bash
"lint:js": "eslint *.js",
"lint:js:fix": "eslint *.js --fix"
```

在 `lint:js` 命令比较短的时候复制粘贴的方法简单粗暴有效，但是当 `lint:js` 命令变的很长之后，难免后续会有人改了 `lint:js` 而忘记修改 `lint:js:fix`。更健壮的做法是，在运行 npm script 时给定额外的参数，代码修改如下：

```bash
"lint:js:fix": "npm run lint:js -- --fix"
```

要格外注意 `--fix` 参数前面的 `--` 分隔符，意指要给 `npm run lint:js` 实际指向的命令传递额外的参数。

#### 3.2 给 npm script 添加注释

如果 package.json 中的 scripts 越来越多，或者出现复杂的编排命令，你可能需要给它们添加注释以保障代码可读性，但 json 天然是不支持添加注释的，下面是 2 种比较 trick 的方式。

第一种方式是，package.json 中可以增加 // 为键的值

```bash
"//": "运行所有代码检查和单元测试",
"test": "npm-run-all --parallel lint:* mocha"
```

这种方式的明显不足是，npm run 列出来的命令列表不能把注释和实际命令对应上，如果你声明了多个，npm run 只会列出最后那个。

另外一种方式是直接在 script 声明中做手脚，因为命令的本质是 shell 命令（适用于 linux 平台），我们可以在命令前面加上注释

```bash
"test": "# 运行所有代码检查和单元测试 \n    npm-run-all --parallel lint:* mocha"
```

注意注释后面的换行符 `\n` 和多余的空格，换行符是用于将注释和命令分隔开，这样命令就相当于微型的 shell 脚本，多余的空格是为了控制缩进，也可以用制表符 `\t` 替代。这种做法能让 npm run 列出来的命令更美观，但是 scripts 声明阅读起来不那么整齐美观。

上面两种方式都有明显的缺陷，更优方案还是把复杂的命令剥离到单独的文件中管理，在单独的文件中可以自由给它添加注释。

#### 3.3 调整 npm script 运行时日志输出

在运行 npm script 出现问题时你需要有能力去调试它，某些情况下你需要让 npm script 以静默的方式运行，这类需求可通过控制运行时日志输出级别来实现。

##### 3.3.1 默认日志输出级别

即不加任何日志控制参数得到的输出，可能是你最常用的，能看到执行的命令、命令执行的结果。

##### 3.3.2 显示尽可能少的有用信息

结合其他工具调用 npm script 的时候比较有用，需要使用 `--loglevel silent`，或者 `--silent`，或者更简单的 `-s` 来控制，这个日志级别的输出实例如下（只有命令本身的输出，读起来非常的简洁）

##### 3.3.3 显示尽可能多的运行时状态

排查脚本问题的时候比较有用，需要使用 `--loglevel verbose`，或者 `--verbose`，或者更简单的 `-d` 来控制，这个日志级别的输出实例如下（详细打印出了每个步骤的参数、返回值）

## 进阶篇

### 1. 使用 npm script 的钩子

为了方便开发者自定义，npm script 的设计者为命令的执行增加了类似生命周期的机制，具体来说就是 `pre` 和 `post` 钩子脚本。这种特性在某些操作前需要做检查、某些操作后需要做清理的情况下非常有用。

举例来说，运行 npm run test 的时候，分 3 个阶段：

1. 检查 scripts 对象中是否存在 pretest 命令，如果有，先执行该命令；
2. 检查是否有 test 命令，有的话运行 test 命令，没有的话报错；
3. 检查是否存在 posttest 命令，如果有，执行 posttest 命令；

```bash
"lint": "npm-run-all --parallel lint:*",
"pretest": "npm run lint",
"test": "mocha test/"
```

#### 增加覆盖率收集

增加覆盖率收集的命令，并且覆盖率收集完毕之后自动打开 html 版本的覆盖率报告。要实现目标，我们需要引入两个新工具：

1. 覆盖率收集工具 [nyc](https://github.com/istanbuljs/nyc)，是覆盖率收集工具 [istanbul](https://istanbul.js.org/) 的命令行版本，istanbul 支持生成各种格式的覆盖率报告；
2. 打开 html 文件的工具 [opn-cli](https://github.com/sindresorhus/opn-cli)，是能够打开任意程序的工具 [opn](https://github.com/sindresorhus/opn) 的命令行版本。

在 package.json 增加 nyc 的配置，告诉 nyc 该忽略哪些文件。最后是在 scripts 中新增 3 条命令：

1. precover，收集覆盖率之前把之前的覆盖率报告目录清理掉；
2. cover，直接调用 nyc，让其生成 html 格式的覆盖率报告；
3. postcover，清理掉临时文件，并且在浏览器中预览覆盖率报告；


```json
{
  "scripts": {
    "precover": "rm -rf coverage",
    "cover": "nyc --report=html npm test",
    "postcover": "rm -rf .nyc_output && opn coverage/index.html"
  },
  "nyc": {
    "exclude": [
      "*.spec.js",
      ".*.js"
    ]
  }
}
```

### 2. 在 npm script 中使用变量

npm 为加高效的执行 npm script 做了大量的优化，创建并运行 npm script 命令 里面讲到的环境变量特性能让我们在 npm script 中直接调用依赖包里的可执行文件，更强大的是，npm 还提供了 `$PATH` 之外的更多的变量，比如当前正在执行的命令、包的名称和版本号、日志输出的级别等。

DRY（Don't Repeat Yourself）是基本的编程原则，在 npm script 中使用预定义变量和自定义变量让我们更容易遵从 DRY 原则，因为使用这些变量之后，npm script 就具备了自适应的能力，我们可以直接把积累起来的 npm script 使用到其他项目里面，而不用做任何修改。

#### 2.1 使用预定义变量

通过运行 `npm run env` 就能拿到完整的变量列表，这个列表非常长，这里使用 `npm run env | grep npm_package | sort` 拿到部分排序后的预定义环境变量。

变量的使用方法遵循 shell 里面的语法，直接在 npm script 给想要引用的变量前面加上 `$` 符号即可。

```bash
"dummy": "echo $npm_package_name"
```

测试覆盖率归档是比较常见的需求，因为它方便我们追踪覆盖率的变化趋势，最彻底的做法是归档到 CI 系统里面，对于简单项目，则可以直接归档到文件系统中，即把收集到的覆盖率报告按版本号去存放。

在根目录下新建 coverage_archive 目录存储覆盖率归档，并利用变量机制把归档和版本号关联起来。具体的 npm script 修改如下：

```json
"scripts": {
  "cover": "nyc --report=html npm test",
  "cover:cleanup": "rm -rf .nyc_output && rm -rf coverage",
  "cover:archive": "mkdir -p coverage_archive/$npm_package_version && cp -r coverage/* coverage_archive/$npm_package_version",
  "postcover": "npm run cover:archive && npm run cover:cleanup && opn coverage_archive/$npm_package_version/index.html "
}
```

cover:archive 做了 2 件事情：

1. `mkdir -p coverage_archive/$npm_package_version`，准备当前版本号的归档目录；
2. `cp -r coverage/* coverage_archive/$npm_package_version`，直接复制文件来归档；
而 postcover 做了 3 件事情：

1. `npm run cover:archive`，归档本次覆盖率报告；
2. `npm run cover:cleanup`，清理本次覆盖率报告；
3. `opn coverage_archive/$npm_package_version/index.html`，直接预览覆盖率报告；

#### 2.2 使用自定义变量

除了预定义变量外，我们还可以在 package.json 中添加自定义变量，并且在 npm script 中使用这些变量。

为把测试覆盖率报告分享给其他同事浏览，我们就不能使用 opn-cli 打开文件了，需要启动简单的 http 服务，把网址发给别人浏览，比如我们约定网址 `http://IP:3000`，这里的 IP 需要替换成自己的实际 IP。

[http-server](https://www.npmjs.com/package/http-server) 提供了非常轻量的 http 服务。

在 package.json 增加自定义端口配置和相应的 npm script 命令：

```json
{
  "config": {
    "ip": "",
    "port": 3000
  },
  "scripts": {
    "cover": "nyc --report=html npm test",
    "cover:archive": "mkdir -p coverage_archive/$npm_package_version && cp -r coverage/* coverage_archive/$npm_package_version",
    "cover:cleanup": "rm -rf .nyc_output && rm -rf coverage",
    "cover:serve": "http-server coverage_archive/$npm_package_version -p $npm_package_config_port",
    "cover:open": "opn http://$npm_package_config_ip:$npm_package_config_port",
    "postcover": "npm-run-all cover:archive cover:cleanup --parallel cover:serve cover:open"
  }
}
```

- 新增的命令 cover:serve 中同时使用了预定义变量 $npm_package_version 和自定义变量 $npm_package_config_port；
- 预览覆盖率报告的方式从直接打开文件修改为打开网址： http://$npm_package_config_ip:$npm_package_config_port；
- postcover 命令要做的事情比较多，我们直接使用 npm-run-all 来编排子命令。

### 3. 实现命令行自动补全

#### 3.1 使用 npm run 直接列出

不带任何参数运行 npm run 能列出 scripts 对象中定义的所有命令，再结合管道操作符、less 命令（这里的 less 不是 css 领域的 less，而是 linux 里面的工具），即使 scripts 子命令很多我们也能移动自如。

```bash
npm run | less
```

按空格能翻页，我们可以进行类似于 Vim 中的搜索，先按 / 进入搜索模式，然后输入 markdown

#### 3.2 把 npm completion 集成到 shell 中

npm 自身提供了自动完成工具 completion，将其集成到 bash 或者 zsh 里也非常容易。

官方文档里面的集成方法如下：

```bash
npm completion >> ~/.bashrc
npm completion >> ~/.zshrc
```

> 如果你好奇上面的命令究竟做了什么，尝试直接运行 `npm completion`，就能看到它其实在你的配置文件中追加了一大坨 shell。上面命令中的 `>>` 意思是把前面命令的输出追加到后面的文件中。

如果你也有代码洁癖，为了保持 .zshrc 或者 .bashrc 文件的整洁，可以用下面的方法：

- 第 1 步，把 npm completion 产生的那坨命令放在单独的文件中：

```bash
npm completion >> ~/.npm-completion.bash
```

- 第 2 步，在 .bashrc 或者 .zshrc 中引入这个文件：

```bash
echo "[ -f ~/.npm-completion.bash ] && source ~/.npm-completion.bash;" >> ~/.bashrc
echo "[ -f ~/.npm-completion.bash ] && source ~/.npm-completion.bash;" >> ~/.zshrc
```

> TIP#11：执行完上面的命令一定要记得 `source ~/.zshrc` 或者 `source ~/.bashrc`，来让自动完成生效。

#### 3.3 更高级的自动完成

- [zsh-better-npm-completion](https://github.com/lukechilds/zsh-better-npm-completion)
- [yarn-completions](https://github.com/mklabs/yarn-completions)

1. 在 npm install 时自动根据历史安装过的包给出补全建议
2. 在 npm uninstall 时候根据 package.json 里面的声明给出补全建议
3. 在 npm run 时补全建议中列出命令细节

## 高级篇

### 1. 实现 npm script 跨平台兼容

如果你在 Linux、Mac 平台做开发，所有的 npm script 都会顺利运行，但是 Windows 下面的同学可能就比较痛苦了，因为不是所有的 shell 命令都是跨平台兼容的，甚至各种常见的文件系统操作也是不兼容的。

#### 1.1 文件系统操作的跨平台兼容

npm script 中涉及到的文件系统操作包括文件和目录的创建、删除、移动、复制等操作，而社区为这些基本操作也提供了跨平台兼容的包，列举如下：

- [rimraf](https://github.com/isaacs/rimraf) 或 [del-cli](https://www.npmjs.com/package/del-cli)，用来删除文件和目录，实现类似于 `rm -rf` 的功能；
- [cpr](https://www.npmjs.com/package/cpr)，用于拷贝、复制文件和目录，实现类似于 `cp -r` 的功能；
- [make-dir-cli](https://www.npmjs.com/package/make-dir-cli)，用于创建目录，实现类似于 `mkdir -p` 的功能；

改造涉及文件系统操作的 npm script：

```json
"scripts": {
  "cover": "nyc --report=html npm test",
  "cover:cleanup": "rimraf .nyc_output && rimraf coverage",
  "cover:archive": "make-dir coverage_archive/$npm_package_version && cpr coverage coverage_arhive/$npm_package_version -o",
  "cover:serve": "http-server coverage_archive/$npm_package_version -p $npm_package_config_port",
  "cover:open": "opn http://localhost:$npm_package_config_port",
  "precover": "npm run cover:cleanup"
  "postcover": "npm-run-all cover:archive --parallel cover:serve cover:open",
}
```

- rm -rf 直接替换成 rimraf；
- mkdir -p 直接替换成 make-dir；
- cp -r 的替换需特别说明下，cpr 默认是不覆盖的，需要显示传入 -o 配置项，并且参数必须严格是 cpr <source> <destination> [options] 的格式，即配置项放在最后面；
- 把 cover:cleanup 从 postcover 挪到 precover 里面去执行，规避 cpr 没归档完毕覆盖率报告就被清空的问题；

#### 1.2 用 cross-var 引用变量

Linux 和 Windows 下引用变量的方式是不同的，Linux 下直接可以用 `$npm_package_name`，而 Windows 下必须使用 `%npm_package_name%`，我们可以使用 [cross-var](https://www.npmjs.com/package/cross-var) 实现跨平台的变量引用。

改写引用变量 npm script：

```bash
"cover:archive": "cross-var \"make-dir coverage_archive/$npm_package_version && cpr coverage coverage_archive/$npm_package_version -o\"",
"cover:serve": "cross-var http-server coverage_archive/$npm_package_version -p $npm_package_config_port",
"cover:open": "cross-var opn http://localhost:$npm_package_config_port"
```

#### 1.3 用 cross-env 设置环境变量

在 node.js 脚本和 npm script 使用环境变量也是比较常见的，比如我们在运行测试时，需要加上 NODE_ENV=test，或者在启动静态资源服务器时自定义端口号。因为不同平台的环境变量语法不同，我们可以使用 [cross-env](https://www.npmjs.com/package/cross-env) 来实现 npm script 的跨平台兼容。

改写使用了环境变量的 npm script：

```bash
"test": "cross-env NODE_ENV=test mocha test/"
```

关于 npm script 的跨平台兼容，还有几点需要注意：

- 所有使用引号的地方，建议使用双引号，并且加上转义；
- 没做特殊处理的命令比如 eslint、stylelint、mocha、opn 等工具本身都是跨平台兼容的；
- 还是强烈建议有能力的同学能使用 Linux 做开发，只要你入门并且熟练了，效率提升会惊人；
- 短时间内继续拥抱 Windows 的同学，可以考虑看看 Windows 10 里面引入的 [Subsystem](https://docs.microsoft.com/zh-cn/windows/wsl/about)，让你不用虚拟机即可在 Windows 下使用大多数 Linux 命令。

### 2. 把庞大的 npm script 拆到单独文件中

当 npm script 不断累积、膨胀的时候，全部放在 package.json 里面可能并不是个好主意，因为这样会导致 package.json 糟乱，可读性降低。

借助 [scripty](https://github.com/testdouble/scripty) 我们可以将 npm script 剥离到单独的文件中，从而把复杂性隔到单独的模块里面，让代码整体看起来更加清晰。

特别注意的是，给所有脚本增加可执行权限是必须的，否则 scripty 执行时会报错，我们可以给所有的脚本增加可执行权限：

```bash
chmod -R a+x scripts/**/*.sh
```

### 3. 用 node.js 脚本替代复杂的 npm script

Node.js 丰富的生态能赋予我们更强的能力，对于前端工程师来说，使用 Node.js 来编写复杂的 npm script 具有明显的 2 个优势：首先，编写简单的工具脚本对前端工程师来说额外的学习成本很低甚至可以忽略不计，其次，因为 Node.js 本身是跨平台的，用它编写的脚本出现跨平台兼容问题的概率很小。

下面我们就一起探索下，如何把上节中使用 shell 编写的 cover 脚本改写成 Node.js 脚本，在 Node.js 脚本中我们也能体味到 [shelljs](https://github.com/shelljs/shelljs) 这个工具包的强大。

shelljs 为我们提供了各种常见命令的跨平台支持，比如 cp、mkdir、rm、cd 等命令，此外，理论上你可以在 Node.js 脚本中使用任何 npmjs.com 上能找到的包。清理归档目录、运行测试、归档并预览覆盖率报告的完整 Node.js 代码如下：

```js
const { rm, cp, mkdir, exec, echo } = require('shelljs');
const chalk = require('chalk');

console.log(chalk.green('1. remove old coverage reports...'));
rm('-rf', 'coverage');
rm('-rf', '.nyc_output');

console.log(chalk.green('2. run test and collect new coverage...'));
exec('nyc --reporter=html npm run test');

console.log(chalk.green('3. archive coverage report by version...'));
mkdir('-p', 'coverage_archive/$npm_package_version');
cp('-r', 'coverage/*', 'coverage_archive/$npm_package_version');

console.log(chalk.green('4. open coverage report for preview...'));
exec('npm-run-all --parallel cover:serve cover:open');.
```

关于改动的几点说明：

- 简单的文件系统操作，建议直接使用 shelljs 提供的 cp、rm 等替换；
- 部分稍复杂的命令，比如 nyc 可以使用 exec 来执行，也可以使用 istanbul 包来完成；
- 在 exec 中也可以大胆的使用 npm script 运行时的环境变量，比如 $npm_package_version；

## 实战篇

### 1. 文件变化时自动运行 npm script

软件工程师做的事情基本都是在实现自动化，比如各种业务系统是为了业务运转的自动化，部署系统是为了运维的自动化，对于开发者本身，自动化也是提升效率的关键环节，在实际开发过程中也有不少事情是可以自动化的。

拥抱现代前端工作流的同学都会有代码风格检查、单元测试等环节，这样就很需要在代码变更之后立即得到反馈，如代码改动导致了那个 Case 失败，哪块不符合团队的编码规范等。

#### 1.1 单元测试自动化

幸运的是，mocha 本身支持 --watch 参数，即在代码变化时自动重跑所有的测试，我们只需要在 scripts 对象中新增一条命令即可。

```bash
"test": "cross-env NODE_ENV=test mocha tests/",
"watch:test": "npm run test -- --watch"
```

#### 1.2 代码检查自动化

我们使用的代码检查工具 [stylelint](https://stylelint.io/)、[eslint](https://eslint.org/)、[jsonlint](https://github.com/zaach/jsonlint) 不全支持 watch 模式，这里我们需要借助 [onchange](https://github.com/Qard/onchange) 工具包来实现，onchange 可以方便的让我们在文件被修改、添加、删除时运行需要的命令。

```bash
"watch": "npm-run-all --parallel watch:*",
"watch:lint": "onchange -i \"**/*.js\" \"**/*.less\" -v -- npm run lint",
"watch:test": "npm t -- --watch"
```

- `watch:lint` 里面的文件匹配模式可以使用通配符，但是模式两边使用了转义的双引号，这样是跨平台兼容的；
- `watch:lint` 里面的 `-i` 参数是让 onchange 在启动时就运行一次 `--` 之后的命令，即代码没变化的时候，变化前后的对比大多数时候还是有价值的；
- `watch:lint` 里面的 `-v` 参数是文件系统发生变化之后，在运行指定命令之前输出哪个文件发生了哪些变化；
- watch 命令实际上是使用了 npm-run-all 来运行所有的 watch 子命令；

### 2. 使用 livereload 实现自动刷新

[browser-sync](http://browsersync.cn/docs/command-line/)

```bash
browser-sync start --server client/ --files \"**/*.css, **/*.html, **/*.js\"
```

### 3. 在 Git Hooks 中执行 npm script

严肃的研发团队都会使用 Git 之类的版本管理系统来管理代码，随着 GitHub 的广受欢迎，相信大家对 Git 并不陌生。Git 在代码版本管理之外，也提供了类似 npm script 里 `pre`、`post` 的钩子机制，叫做 Git Hooks，钩子机制能让我们在代码 commit、push 之前（后）做自己想做的事情。

Git Hooks 能给我们的开发工作流带来哪些可能呢？我带的团队中，大部分项目通过 npm script 为本地仓库配置了 pre-commit、pre-push 钩子检查，且正计划为远程仓库（Remotes）配置 pre-receive 钩子检查。两种钩子的检查目的各不相同，本地检查是为了尽早给提交代码的同学反馈，哪些地方不符合规范，哪些地方需要注意；而远程检查是为了确保远程仓库收到的代码是符合团队约定的规范的，因为如果没有远程检查环节，熟悉 Git 的同学使用 `--no-verify`（简写为 `-n`） 参数跳过本地检查时，本地检查就形同虚设。

前端社区里有多种结合 npm script 和 git-hooks 的方案，比如 [pre-commit](https://github.com/observing/pre-commit)、[husky](https://github.com/typicode/husky)，相比较而言 husky 更好用，它支持更多的 Git Hooks 种类，再结合 [lint-staged](https://github.com/okonet/lint-staged) 使用就更溜。

在 scripts 对象中增加 husky 能识别的 Git Hooks 脚本：

```bash
"precommit": "npm run lint",
"prepush": "npm run test"
```

如上的配置乍看起来没有任何问题，但是在大型项目、遗留项目中接入过 lint 工作流的同学可能深有体会，每次提交代码会检查所有的代码，可能比较慢就不说了，接入初期 lint 工具可能会报告几百上千个错误，这时候估计大多数人内心是崩溃的，尤其是当你是新规范的推进者，遇到的阻力会增大好几倍，毕竟大多数人不愿意背别人的锅。

好在，我们有 lint-staged 来缓解这个问题，每个团队成员提交的时候，只检查当次改动的文件，具体改动如下：

```json
{
  "scripts": {
    "precommit": "lint-staged",
    "prepush": "npm run test"
  },
  "lint-staged": {
    "*.js": "eslint",
    "*.less": "stylelint",
    "*.css": "stylelint",
    "*.json": "jsonlint --quiet",
    "*.md": "markdownlint --config .markdownlint.json"
  }
}
```

关于 lint-staged 还有些高级的用法，比如对单个文件执行多条命令，对单个文件动态自动修复，自动格式化等等。

### 4. 使用 npm script 实现构建流水线

在现代前端项目的交付工作流中，部署前最关键的环节就是构建，构建环节要完成的事情通常包括：

- 源代码预编译：比如 less、sass、typescript；
- 图片优化、雪碧图生成；
- JS、CSS 合并、压缩；
- 静态资源加版本号和引用替换；
- 静态资源传 CDN 等。

#### 构建目录

```bash
"prebuild": "rm -rf dist && mkdir -p dist/{images,styles,scripts}"
```

#### 构建脚本

构建过程需要的命令稍长，我们可以使用 scripty 来把这些脚本剥离到单独的文件中，为此需要准备单独的目录，并且我们的构建过程分为：images、styles、scripts、hash 四个步骤，每个步骤准备单独的文件。

```bash
mkdir scripts/build
touch scripts/build.sh
touch scripts/build/{images,styles,scripts}.sh
chmod -R a+x scripts
```

#### 4.1 图片构建

图片构建的经典工具是 [imagemin](https://github.com/imagemin/imagemin)，它也提供了命令行版本 [imagemin-cli](https://github.com/imagemin/imagemin-cli)。

```bash
imagemin client/images/* --out-dir=dist/images
```

#### 4.2 样式构建

我们使用 [less](http://lesscss.org/usage/) 编写样式，所以需要预编译样式代码，可以使用 less 官方库自带的命令行工具 lessc，使用 sass 的同学可以直接使用 [node-sass](https://github.com/sass/node-sass)。此外，样式预编译完成之后，我们需要使用 [cssmin](https://www.npmjs.com/package/cssmin) 来完成代码预压缩。

```bash
for file in client/styles/*.less
do
  lessc $file | cssmin > dist/styles/$(basename $file .less).css
done
```

#### 4.3 JS 构建

我们使用 ES6 编写 JS 代码，所以需要 [uglify-es](https://github.com/mishoo/UglifyJS2/tree/harmony) 来进行代码压缩，如果你不使用 ES6，可以直接使用 [uglify-js](https://github.com/mishoo/UglifyJS2) 来压缩代码。

```bash
for file in client/scripts/*.js
do
	./node_modules/uglify-es/bin/uglifyjs $file --mangle > dist/scripts/$(basename $file)
done
```

#### 4.4 资源版本号和引用替换

给静态资源加版本号的原因是线上环境的静态资源通常都放在 CDN 上，或者设置了很长时间的缓存，或者两者兼有，如果资源更新了但没有更新版本号，浏览器端是拿不到最新内容的，手动加版本号的过程很繁琐并且容易出错，为此自动化这个过程就显得非常有价值，通常的做法是利用文件内容做哈希，比如 md5，然后以这个哈希值作为版本号，版本号附着在文件名里面，线上环境的资源引用全部是带版本号的。

为了实现这个过程，我们需要引入两个小工具：

- [hashmark](https://github.com/keithamus/hashmark)，自动添加版本号；
- [replaceinfiles](https://github.com/songkick/replaceinfiles)，自动完成引用替换，它需要家版本号过程的输出作为输入；

```bash
# 给图片资源加上版本号，并且替换引用
hashmark -c dist -r -l 8 '**/*.{png,jpg}' '{dir}/{name}.{hash}{ext}' | replaceinfiles -S -s 'dist/**/*.css' -d '{dir}/{base}'

# 给 js、css 资源加上版本号，并且替换引用
hashmark -c dist -r -l 8 '**/*.{css,js}' '{dir}/{name}.{hash}{ext}' | replaceinfiles -S -s 'client/index.html' -d 'dist/index.html'
```

#### 完整的构建步骤

```bash
"prebuild": "rm -rf dist && mkdir -p dist/{images,styles,scripts}",
"build": "scripty",
"build:images": "scripty",
"build:scripts": "scripty",
"build:styles": "scripty",
"build:hash": "scripty"
```

其中 `scripts/build.sh` 内容如下：

```bash
for step in 'images' 'scripts' 'styles' 'hash'
do
  npm run build:$step
done
```

### 5. 使用 npm script 进行服务运维

通常来说，项目构建完成之后，就成为待发布的版本，因此版本管理需要考虑，甚至做成自动化的，然后，最新的代码需要部署到线上机器才能让所有用户访问到，部署环节涉及到服务的启动、重启、日志管理等需要考虑。

#### 5.1 使用 npm script 进行版本管理

每次构建完的代码都应该有新的版本号，修改版本号直接使用 npm 内置的 version 自命令即可，如果是简单粗暴的版本管理，可以在 package.json 中添加如下 scripts：

```bash
"release:patch": "npm version patch && git push && git push --tags",
"release:minor": "npm version minor && git push && git push --tags",
"release:major": "npm version major && git push && git push --tags"
```

这 3 条命令遵循 [semver](https://semver.org/) 的版本号规范来方便你管理版本，patch 是更新补丁版本，minor 是更新小版本，major 是更新大版本。

如果要求所有的版本号不超过 10，即 0.0.9 的下个版本是 0.1.0 而不是 0.0.10，可以编写简单的 shell 脚本来实现（注意这样会破坏 semver 的约定），具体步骤如下：

```bash
#!/usr/bin/env bash

# get major/minor/patch version to change
version=`cat package.json| grep version | grep -v release | awk -F\" '{print $4}'`
components=($(echo $version | tr '.' '\n'))
major=${components[0]}
minor=${components[1]}
patch=${components[2]}

release='patch';

# decide which version to increment
if [ $patch -ge 9 ]; then
    if [ $minor -ge 9 ]; then
        release='major'
    else
        release='minor'
    fi
else
    release='patch'
fi

echo "major=$major, minor=$minor, patch=$patch, release=$release"

# upgrade version
npm run release:$release
```

#### 5.2 使用 npm script 进行服务进程和日志管理

在生产环境的服务进程和日志管理领域，[pm2](http://pm2.keymetrics.io/) 是当之无愧的首选，功能很强大，使用简单，开发环境常用的是 [nodemon](https://www.npmjs.com/package/nodemon)。

在我们的项目中使用 npm script 进行服务进程和日志管理的基本步骤如下：

##### 5.2.1. 准备 http 服务

在使用 npm script 作为构建流水线的基础上，我们在项目中引入了 express 和 morgan，并使用如下脚本启动 http 服务器方便用户访问我们的网页（morgan 使用来记录用户的访问日志的）：

```javascript
const express = require('express');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('./dist'));
app.use(morgan('combined'));

app.listen(port, err => {
  if (err) {
    console.error('server start error', err); // eslint-disable-line
    process.exit(1);
  }

  console.log(`server started at port ${port}`);  // eslint-disable-line
});
```

##### 5.2.2. 准备日志目录

```bash
mkdir logs
touch logs/.gitkeep
git add logs/.gitkeep
git commit -m 'add logs folder'
```

这里加 logs/.gitkeep 空文件的目的是为了能把 logs 目录提交到 git 里面，但是我们故意忽略 logs 目录里面的内容，这是在 git 中提交目录结构而忽略其中内容的常见做法。

##### 5.2.3. 安装和配置 pm2

添加服务启动配置到项目根目录下 pm2.json，更多配置项可以参照[文档](http://pm2.keymetrics.io/docs/usage/application-declaration/)：

```json
{
  "apps": [
    {
      "name": "npm-script-workflow",
      "script": "./server.js",
      "out_file": "./logs/stdout.log",
      "error_file": "./logs/stderr.log",
      "log_date_format": "YYYY-MM-DD HH:mm:ss",
      "instances": 0,
      "exec_mode": "cluster",
      "max_memory_restart": "800M",
      "merge_logs": true,
      "env": {
        "NODE_ENV": "production",
        "PORT": 8080,
      }
    }
  ]
}
```

上面的配置指定了服务脚本为 server.js，日志输出文件路径，日志时间格式，进程数量 = CPU 核数，启动方式为 cluster，以及两个环境变量。

##### 5.2.4. 配置服务部署命令

```bash
"predeploy": "yarn && npm run build",
"deploy": "pm2 restart pm2.json"
```

##### 5.2.5. 配置日志查看命令

至于日志，虽然 pm2 提供了内置的 logs 管理命令，如果某台服务器上启动了多个不同的服务进程，那么 pm2 logs 会展示所有服务的日志，个人建议使用如下命令查看当前服务的日志：

```bash
"logs": "tail -f logs/*"
```
