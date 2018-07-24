# 设计模式

思考：

- 为什么要设计/抽象，它的本质是什么

  - 需求变化
  - 后续维护

- JavaScript 有什么特点，什么样的设计模式适合这门语言

- 了解“逻辑”背后的信息比如：

  - 满足什么需求？
  - 解决什么问题？
  - 变化会多频繁？
  - 有什么痛点？

## 行为模式 Behavior

- 从交互需求出发设计一组“动作行为”
- 在主体对象上应用和扩展这些行为

### 图片预览

```html
<div class="wrapper">
  <ul id="list">
    <li>
      <img src="https://p4.ssl.qhimg.com/t01713d89cfdb45cdf5.jpg">
    </li>
    <li>
      <img src="https://p4.ssl.qhimg.com/t01e456146c8f8a639a.jpg">
    </li>
    <li>
      <img src="https://p1.ssl.qhimg.com/t015f613e2205b573d8.jpg">
    </li>
    <li>
      <img src="https://p0.ssl.qhimg.com/t01290338a28018d404.jpg">
    </li>
    <li>
      <img src="https://p3.ssl.qhimg.com/t01d9aa5ae469c8862e.jpg">
    </li>
    <li>
      <img src="https://p3.ssl.qhimg.com/t01cb20d35fc4aa3c0d.jpg">
    </li>
    <li>
      <img src="https://p5.ssl.qhimg.com/t0110b30256941b9611.jpg">
    </li>
  </ul>
</div>
<div id="mask">
  <a class="previous" href="###">&lt;</a>
  <img id="preview-image" src="">
  <a class="next" href="###">&gt;</a>
</div>
```

```css
.wrapper {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  overflow: scroll;
}

#list {
  list-style-type: none;
  justify-content: flex-start;
  display: flex;
  flex-wrap: wrap;
}

#list li {
  padding: 10px;
  margin: 0;
}
#list img {
  height: 200px;
  cursor: pointer;
}

#mask {
  position: absolute;
  left: 0;
  top:  0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.8);
  display: none;
  user-select: none;
}

#mask .previous,
#mask .next{
  width: 30px;
  text-align: center;
  color: white;
  font-size: 2em;
  top : 50%;
  transform: translateY(-50%);
  position: absolute;
  text-decoration: none;
}

#mask .next{
  right: 0;
}
#mask img{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  max-height: 90%;
  max-width: 90%;
}
```

```js
var imgList = document.getElementById('list')
var imgs = document.querySelectorAll('li img')

function setPreviewBehavior(subjects) {
  var previewEvent = document.createEvent('Event');
  previewEvent.initEvent('preview', true, true)

  if (!Array.isArray(subjects)) {
     if (subjects.length) {
       subjects = Array.from(subjects)
     } else {
       subjects = [subjects]
     }
  }

  previewEvent.previewTargets = subjects.map(evt => {
    return evt.src
  })

  subjects.forEach(subject => {
    subject.preview = function () {
      subject.dispatchEvent(previewEvent)
    }
  })
}

setPreviewBehavior(imgs)

var previewMask = document.getElementById('mask');
var previewImage = previewMask.querySelector('img')
var previewPrevious = previewMask.querySelector('.previous');
var previewNext = previewMask.querySelector('.next');

previewMask.addEventListener('click', function (evt) {
  if (evt.target === previewMask) {
    previewMask.style.display = 'none';
  }
})

// imgs.forEach(img => {
//   img.addEventListener('mouseenter', function (evt) {
//     if(evt.target.preview) {
//       evt.target.preview()
//     }
//   })
// })

imgList.addEventListener('click', function(evt) {
  if (evt.target.preview) {
    evt.target.preview()
  }
})

imgList.addEventListener('preview', function (evt) {
  var src = evt.target.src,
      previewTargets = evt.previewTargets;
  previewMask.style.display = 'block';
  previewImage.src = src;

  var idx = previewTargets.indexOf(src)

  function updateButton(idx) {
    previewPrevious.style.display = idx ? 'block': 'none'
    previewNext.style.display = idx < previewTargets.length - 1 ? 'block' : 'none'
  }

  updateButton(idx)

  previewPrevious.addEventListener('click', function (evt) {
    previewImage.src = previewTargets[--idx];
    updateButton(idx)
  })

  previewNext.addEventListener('click', function (evt) {
    previewImage.src = previewTargets[++idx];
    updateButton(idx)
  })
})
```

### 选取图片

```js
var imgList = document.getElementById('list')
var images = list.querySelectorAll('img')

function setSelectionBehavior(subjects, className) {
  var selectEvent = document.createEvent('Event')
  selectEvent.initEvent('select', true, true)

  if (!Array.isArray(subjects)) {
     if (subjects.length) subjects = Array.from(subjects)
     else subjects = [subjects]
  }

  // 是否包含 className
  function hasClass(el) {
    var regex = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g')
    return regex.test(el.className)
  }

  // 添加 className
  function addClass(el) {
    if (hasClass(el)) return false;
    el.className += ' ' + className;
    return true;
  }

  // 移除 className
  function removeClass(el) {
    if (hasClass(el)) {
      var regex = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g')
      el.className = el.className.replace(regex, '')
      return true
    }
    return false
  }

  // 所有选中的图片
  var selectedTargets = subjects.filter(function(el) {
    return hasClass(el)
  })

  selectEvent.selectedTargets = selectedTargets

  subjects.forEach(function (subject) {
    subject.select = function (altKey, shiftKey) {
      if (!altKey && !shiftKey) {
        selectedTargets.forEach(function (target) {
          removeClass(target)
        })
        selectedTargets.length = 0

        addClass(this)
        selectedTargets.push(this)
      } else if (altKey) { // 按下 alt 键
        if (hasClass(this)) {
          selectedTargets.splice(selectedTargets.indexOf(this), 1)
          removeClass(this)
        } else {
          selectedTargets.push(this)
          addClass(this)
        }
      } else if (shiftKey) { // 按下 shift 键
        var lastTarget = selectedTargets[selectedTargets.length - 1]
        if (lastTarget && lastTarget !== this) {
          selectedTargets.forEach(function (target) {
            removeClass(target)
          })
          selectedTargets.length = 0

          // 顺序选中
          var idxFrom = subjects.indexOf(lastTarget),
              idxTo = subjects.indexOf(this)

          if (idxFrom > idxTo) {
            var tmp = idxTo
            idxTo = idxFrom
            idxFrom = tmp
          }

          var targets = subjects.slice(idxFrom + 1, idxTo)
          targets.forEach(function (el) {
            if (!hasClass(el)) {
              selectedTargets.push(el)
              addClass(el)
            }
          })

          if (!hasClass(this)) {
            selectedTargets.push(this)
            addClass(this)
          }

          selectedTargets.push(lastTarget)
          addClass(lastTarget)
        }
      }

      this.dispatchEvent(selectEvent)
    }
  })
}

setSelectionBehavior(images, 'selected')

imgList.addEventListener('click', function (evt) {
  if (evt.target.select) {
    evt.target.select(evt.altKey, evt.shiftKey)
  }
})

imgList.addEventListener('select', function (evt) {
  console.log(evt.selectedTargets)
})

```

### 图片上传

```html
<input id="selectFile" type="file" accept="image/png" multiple="multiple"></input>

<div id="preview">
</div>
```

```js
function setSelectFileBehavior(subjects) {
  if (!Array.isArray(subjects)) {
    if (subjects.length) subjects = Array.from(subjects)
    else subjects = [subjects]
  }

  subjects.forEach(subject => {
    subject.addEventListener('change', function (evt) {
      var fileInput = evt.target
      var files = Array.from(fileInput.files)
      var URL = window.URL || window.webkitURL

      if (typeof FileReader === 'function') {
        files.forEach(function(file) {
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (evt) {
            var event = new CustomEvent('fileselect', {
              detail: {
                dataURL: evt.target.result
              }
            });
            subject.dispatchEvent(event);
          };
        });
      } else if (URL) {
        files.forEach(function(file) {
          var blob = URL.createObjectURL();
          var event = new CustomEvent('fileselect', {
            detail: {
              blob: blob
            }
          });

          subject.dispatchEvent(event);
        })
      }
    })
  })
}

setSelectFileBehavior(selectFile)

selectFile.addEventListener('change',function () {
  preview.innerHTML = ''
})

selectFile.addEventListener('fileselect', function (evt) {
  var img = new Image();
  img.src = evt.detail.dataURL || evt.detail.blob;
  img.style.padding = '5px';
  img.style.height = '150px';
  preview.appendChild(img);
})
```

## 适配器 Adapter

- 针对不同底层实现提供统一的外部接口
- 让业务层面的代码可以适应不同的底层实现

## 观察者模式 Observer

解决多个对象状态变化之间的同步

- 同步多个对象的状态变化
- 解耦各个对象之间的依赖

### 同步滚动

```html
<!DOCTYPE html>
<html>
  <body>
    <textarea id="editor" oninput="this.editor.update()"
              rows="6" cols="60">
在 2001 到 2003 年间，Judith Miller 在纽约时报上发表了一批文章，宣称伊拉克有能力和野心生产大规模杀伤性武器。这是假新闻。

回顾当年，我们无法确定 Miller 写的这些故事在美国 2013 年做出发动伊拉克战争的决定中扮演了怎样的角色；与 Miller 相同来源的消息与小布什政府的对外政策团队有很大关联。但是，纽约时报仍然起到了为这一政策背书的作用，尤其是对民主党人，本来他们应该会更坚定地反对小布什的政策。毕竟，纽约时报可不是一些无人问津的地方小报，它是整个美国影响力最大的报刊，它一般被认为具有左倾倾向。Miller 的故事某种程度上吻合报纸的政治倾向。

我们可以把 Miller 的错误和最近关于 Facebook 的假新闻问题联系起来看；Facebook 用自己的故事告诫我们“假新闻是坏的”。然而，我持有不同的观点：**新闻假不假没那么重要，由谁来决定什么是新闻才是第一重要的**。

<!--more-->

#### Facebook 的媒体商业化

在[聚集理论](https://stratechery.com/2015/aggregation-theory/)中，我描述了基于分配的经济权利的消亡导致强势中介的崛起，它们掌控客户体验并将它们的供应商商品化。[在 Facebook 的例子里](https://stratechery.com/2016/the-fang-playbook/)，社交网络之所以兴起，是因为之前存在的线下社会网络在往线上网络转变。考虑到人类本质是社会化的，用户开始将时间花在 Facebook 上阅读、发表观点和获取新闻。

随后，Facebook 吸引了媒体、商业公司以及其他希望获得用户注意的公司进驻。这对于 Facebook 来说很棒：Facebook 提供越多的好内容给用户，用户就花越多的时间上 Facebook，Facebook 将广告展现给用户的机会就越多。而反过来，用户花越多时间上 Facebook，他们阅读其他资讯的时间就越少，这进一步加速了媒体（以及商业公司和其他公司）将内容搬到 Facebook 上，产生 Facebook 受欢迎的良性循环：通过获得用户，Facebook 吸引了内容供应商，内容供应商间接帮助 Facebook 进一步深化运营用户，增加的用户也带给内容供应商更多的收益。

这个过程让 Facebook 的内容供应商，即媒体公司，简化了它们的角色，成为纯粹的供货商。Facebook 根据内容的用户参与度计算出重要程度，让每个角色都各取所需：媒体公司获得了广告，Facebook 获得了分享，而用户从庞大的信息数据库中得到他们想看的内容。当然不是所有内容都能吸引所有用户；这就是算法要做的事情：给用户展现他们感兴趣的内容，不论是婴儿图片、征婚启示、喵星人图片、小测验还是政治新闻。根据 Facebook 的观点，或者坦白说，根据 Facebook 用户的观点，这些内容没什么区别。当然其中也包含有假新闻，顺便提一下：在 Facebook 看来，[来自马其顿的新闻](https://www.buzzfeed.com/craigsilverman/how-macedonia-became-a-global-hub-for-pro-trump-misinfo)和其它内容一样，并没什么特别的，对于推荐算法来说，它们都是内容，仅根据参与程度影响它的推荐量。

#### 媒体和特朗普

现在在媒体上有许多讨论，关于特朗普的当选。观点是如果媒体没有给特朗普[价值数十亿美元的免费报道](http://www.nytimes.com/2016/03/16/upshot/measuring-donald-trumps-mammoth-advantage-in-free-media.html) —— 基本上是媒体报道（而不是付费报道，那种是广告）—— 特朗普永远也当选不了，因此媒体要为特朗普的当选负责。这一看似合理的自我反思，让行业拒绝承认一个更令人不安的现实：如果他们不想要如此的话，媒体不可能做成这件该死的事。

**媒体广泛报道特朗普的理由非常简单：这是用户想看到的内容。在媒体商品化的今天，如果像以前那样有编辑特权来决定不报道潜在用户想要看到的内容，就得面对被用户打脸的现实，点击量下降是媒体所不愿承受的。**

事实上，假新闻大行其道也是因为同样的原因：因为用户喜闻乐见。这些网站获得流量，因为用户点击并分享它们的文章，因为用户想确认他们心中已经相信是真实的内容（尽管实际上是假的）。确认偏差（即人们更容易相信他们愿意相信的内容 —— 译者注）是一种毒品 —— 正如 Techcrunch 的记者 Kim-Mai Cutler [在 twitter 上如此贴切地说](https://twitter.com/kimmaicutler/status/796560990854905857)，这是一种商业模式的原罪。

#### 为什么 Facebook 应该删除假新闻

所以现在我们回到关于如何处理假新闻的问题。也许[纽约时报 的 Zeynep Tufekci](http://www.nytimes.com/2016/11/15/opinion/mark-zuckerberg-is-in-denial.html) 的观点最能代表一般大众的情绪：Facebook 应当消除假新闻以及取消给人们推荐他们心中已经认同的观点的新闻的倾向。Tufekci 写道：

> Mark Zuckerberg, Facebook 的老板，认为Facebook 的假新闻影响选举是个疯狂的想法，因为那些是非常少量的内容，对选举几乎没有影响。他的这种不过脑的坚持，认为他的公司对人们做出决定没有影响的行为，实际上已经对美国和全世界的民主带来了真正的损害……

> Facebook 影响政治话语的问题的问题不仅限于传播假新闻。它还有回音室效应。它的推荐算法选择哪些资讯更新出现在用户阅读列表的前面以及哪些被顶到后面去。人类已经倾向于聚集在志同道合的人之中，寻找证实他们偏见的消息。Facebook 的研究显示这家公司的算法通过优先更新用户更愿意看到的内容而鼓励了这一行为。

Tufekci 给 Facebook 提供了一些建议，包括与外部研究人员分享数据从而更好地理解错误消息如何传播，以及应该如何对付过虑气泡（即智能推荐算法根据你的兴趣推荐内容，像一个泡泡将你包裹起来，把你和其他未推荐内容隔离起来——译者注），以更积极地行动，消除假新闻，就像处理作弊和其他垃圾内容那样，还包括重新启用人类编辑以及重新调整算法来有利于新闻平衡而不是一味通过参与度来推荐。

#### 为什么 Facebook 不应该这么做


从表面上看，这一切都很合理，但是实际上，Tufekci 的建议有点自以为是。

首先，Facebook 没有动机去做这些事；当时 Facebook [否决](http://www.slate.com/blogs/future_tense/2016/11/14/did_facebook_really_tolerate_fake_news_to_appease_conservatives.html)了这些提议，[根据 Gizmodo 的报道](http://gizmodo.com/facebooks-fight-against-fake-news-was-undercut-by-fear-1788808204)，Facebook 搁置了对新闻推荐算法的改变，这一改变本可能消除假消息，Facebook 的解释是如果那么做，会对右翼站点造成不公平的影响，事实上 Facebook 非常重视在各方观点中保持中立；其他任何行为都会导致用户流失，而这对社交网络来说是不能承受之重。

此外，除了聚焦于参与度之外，任何偏离这一准则的行为都一定会减少用户在 Facebook 上所花费的时间，而在这里 Tufekci 错误地认为这是可接受的，因为他完全没有考虑“竞争对手”。事实上，Facebook 在很长一段时间内处于被挑战的地位上：Snapchat 正在从 Facebook 最有价值的人群中获取关注，尽管新闻资讯的广告变现能力已经接近饱和，Snapchat 依然在最具有价值的科技消费领域威胁着 Facebook：那是以电视为中心的品牌广告领域。

而且，还有更根本的问题：你如何决定哪些新闻是假新闻？准则是什么？而也许最关键的是，谁来决定？认为一些假新闻存在于其他海量内容中，从而得对 Facebook 内容进行编辑并不仅是一个简单的后勤噩梦，而且，至少当涉及到潜在的不良后果时，这个问题远没有它表面上看来那么简单。

实际情况比过滤气泡问题要复杂得多：从指责 Facebook 通过参与度驱动的二阶效应来影响它的用户的信息流，到坚持由于政治原因让平台积极干预用户看到的内容，这两者之间存在巨大的鸿沟。这不是关于建设更好社会的目标和两党争斗的对立，毕竟，支持者认为他们的目标也是建设更好的社会。事实上，如果整个值得关注的点是，Facebook 在其用户的新闻消费中扮演的重要角色，那么更大的恐惧应该是如果坚持人工干预的话，如何防止有人积极地滥用干预者这一角色为自己的利益服务。

我明白为什么自上而下的解决方案是诱人的：假新闻和过滤气泡是摆在我们眼前的问题，如果让 Facebook 修复它们难道不是更好吗？问题是这得假设动用自上而下的权力来做这一切的某人会正好与我的观点相同。那么，如果他们不呢？只要看一下我们现在的政治处境：那些担心特朗普的人，也必须承认的一个事实是，行政部门的权力在过去几十年里已经急剧扩大；我们将巨大的责任和权力交到一个人手中，而忘记了**权力和责任交出容易，收回难**。

因此，如果 Facebook 真的开始主动干预新闻内容，我会更加担忧；正如我[上周指出的](https://stratechery.com/2016/why-twitter-must-be-saved/)，我越来越担心 Zuckerberg 的乌托邦式的观点，要知道，从影响世界到控制世界只有一步之遥。正如政府监管有坏处：当谈到暴政的时候，我们最重要的自由是言论自由，而把一个官员 —— 向总统汇报的人 —— 置于负责监管人们所见内容的位置上，是与这种自由精神背道而驰的。

要牢记的关键一点是假新闻的实际影响是取决于谁传播它：当然，那些马其顿的新闻故事不好，但是它们起作用了，尽管不怎么好，有些人却愿意相信。对比 Miller 在纽约时报的故事：由于纽约时报具有公信力，许多人因此改变了他们的观点，导致了一场到今天影响还没能完全消除的灾难。考虑到这一点，让 Facebook 人工干预新闻结果的潜在风险几乎无法想象。

#### 自由和懒惰

也许有一些折衷方案：对于有些明显是假的新闻来源，Facebook 可以简单地将它们拉黑，更理想的情况，Facebook 可以透明地给出它们做了什么，以及为什么被拉黑的理由。而更进一步，Facebook 在不损害其竞争地位的情况下，可以将部分数据共享给外部研究者，它应该这样做。Facebook 也应该提供更多的配置选项给用户来控制他们的信息流，如果希望避免过滤起泡，可以通过修改配置来做到。

其实，你和我都知道，很少有用户会困扰。而且，表面上看，让许多 Facebook 的批评者最困扰的是，他们觉得如果用户不寻求“正确的”新闻来源，那么，应该有人让他们看到。这听起来很伟大 —— 而且毫无问题，是赢得选举的一个更方便的解决方案，而不必实际做出必要的改变 —— 直到你想起来，你刚刚给了委托人如此大的权力，而他可能不同意你的意见，而人为控制人们所看到的内容是极权主义的标志。

让我总结一下：我很清楚 Facebook 的影响有一定的问题；我特别担心的是，我们为了偷懒，用部落的思路来解决这一问题，影响选举的部分原因是由于如上所述的过滤气泡效应所致（这是为什么 [Twitter 必须存在](https://stratechery.com/2016/why-twitter-must-be-saved/)的原因之一）。但是解决办法不是在互联网添加人为把关；要解决这一问题必须要通过互联网的力量，而事实上，我们每一个人，如果我们想要，是可以获得比以前任何时候更多的信息和资源真相的。如果我们想要，我们也可以有更多的方法来接触、理解和说服那些与我们意见相左的人。是的，这比要求 Zuckerberg 改变人们看到的内容有更多的工作要做，但是**因为懒惰而放弃自由从未有过好结果**。

    </textarea>
    <div id="preview"> </div>
    <div id="hintbar"> 0% </div>
    <script src="https://s3.ssl.qhres.com/!67fc024a/markdown.min.js"></script>
  </body>
</html>
```

```css
body{
  display: flex;
}

#editor {
  width: 45%;
  height: 350px;
  margin-right: 10px;
}

#preview {
  width: 45%;
  height: 350px;
  overflow: scroll;
}

#hintbar {
  position: absolute;
  right: 10px;
}
```

```js
function Editor(input, preview) {
  this.update = function () {
    preview.innerHTML = markdown.toHTML(input.value);
  };
  this.update();
}

new Editor(editor, preview);

// function update(src, dest, hint) {
//    var scrollRange = src.scrollHeight - src.clientHeight,
//        p = src.scrollTop / scrollRange;
//    dest.scrollTop = p * (dest.scrollHeight - dest.clientHeight)
//    hint.innerHTML = Math.round(p * 100) + '%';
// }

function setObserverBehavior(subjects) {
  if (!Array.isArray(subjects)) {
    if (subjects.length) subjects = Array.from(subjects);
    else subjects = [subjects];
  }

  subjects.forEach(function (subject) {
//     subject.watchBy = monopoly();
    subject.watchBy = function (target, type) {
       subject.addEventListener(type, function (evt) {
          evt.sender = subject;
          evt.receiver = target;
          if (target.notice) target.notice(type, evt);
       });
    };
  });
}

setObserverBehavior(editor);
editor.watchBy(preview, 'scroll');
editor.watchBy(hintbar, 'scroll');

setObserverBehavior(preview);
preview.watchBy(editor, 'scroll');
preview.watchBy(hintbar, 'scroll');

editor.notice = monopoly(function (type, evt) {
  var sender = evt.sender,
      receiver = evt.receiver;
  var scrollRange = sender.scrollHeight - sender.clientHeight,
       p = sender.scrollTop / scrollRange;
  receiver.scrollTop = p * (receiver.scrollHeight - receiver.clientHeight);
});

preview.notice = monopoly(function (type, evt) {
  var sender = evt.sender,
      receiver = evt.receiver;
  var scrollRange = sender.scrollHeight - sender.clientHeight,
       p = sender.scrollTop / scrollRange;
  receiver.scrollTop = p * (receiver.scrollHeight - receiver.clientHeight);
});

hintbar.notice = function (type, evt) {
  var sender = evt.sender,
      receiver = evt.receiver;
  var scrollRange = sender.scrollHeight - sender.clientHeight,
       p = sender.scrollTop / scrollRange;
  receiver.innerHTML = Math.round(p * 100) + '%';
};

function monopoly(fn, duration) {
  duration = duration || 100;
   return function () {
     if (!monopoly.permit) {
       monopoly.permit = fn;
     }
     if (monopoly.permit === fn) {
       clearTimeout(monopoly.permitTimer);
       monopoly.permitTimer = setTimeout(function() {
         delete monopoly.permit;
       }, duration);
       return fn.apply(this, arguments);
     }
   };
}

// editor.addEventListener('scroll', monopoly(function() {
//   update(editor, preview, hintbar)
// }))

// preview.addEventListener('scroll', monopoly(function() {
//   update(preview, editor, hintbar)
// }))
```

## 中介者 Mediator

- 将命令传递给所有订阅者

- 与所有订阅者之间维持依赖关系

- 从而让订阅者彼此之间项目独立

### 同步滚动——改用 pub/sub

```js
function Editor(input, preview) {
  this.update = function () {
    preview.innerHTML = markdown.toHTML(input.value);
  };
  this.update();
}

new Editor(editor, preview);

function monopoly(fn, duration) {
  duration = duration || 100;
   return function () {
     if (!monopoly.permit) {
       monopoly.permit = fn;
     }
     if (monopoly.permit === fn) {
       clearTimeout(monopoly.permitTimer);
       monopoly.permitTimer = setTimeout(function() {
         delete monopoly.permit;
       }, duration);
       return fn.apply(this, arguments);
     }
   };
}

function PubSub() {
  this.subscribers = {};
}

PubSub.prototype = {
  constructor: PubSub,
  pub: function (type, data) {
    var subscribers = this.subscribers[type];
    subscribers.forEach(function (subscriber) {
      subscriber(data);
    });
  },
  sub: function (type, target, fn) {
    this.subscribers[type] = this.subscribers[type] || [];
    this.subscribers[type].push(fn.bind(target));
  }
};

var mediator = new PubSub();

editor.addEventListener('scroll', monopoly(function (evt) {
  var target = evt.target;
  var scrollRange = target.scrollHeight - target.clientHeight,
      p = target.scrollTop / scrollRange;
  mediator.pub('scroll', p);
}));

preview.addEventListener('scroll', monopoly(function (evt) {
  var target = evt.target;
  var scrollRange = target.scrollHeight - target.clientHeight,
      p = target.scrollTop / scrollRange;
  mediator.pub('scroll', p);
}));

mediator.sub('scroll', editor, function (p) {
  this.scrollTop = p * (this.scrollHeight - this.clientHeight);
});

mediator.sub('scroll', preview, function (p) {
  this.scrollTop = p * (this.scrollHeight - this.clientHeight);
});

mediator.sub('scroll', hintbar, function (p) {
  this.innerHTML = Math.round(p * 100) + '%';
});

mediator.sub('scroll', document.body, function (p) {
  this.style.backgroundColor = `rgba(${Math.round(255 * p)}, 0, 0, .2)`;
});
```

Observer 与 Mediator

## 复合 Composite

- 对已有组件/库/功能的组合使用

- 提升代码复用性的最常用手段

## Partial Application

- Function.prototype.bind

- 部分应用/固化参数

```node
import path from 'path'
const resolve = path.resolve.bind(path, __dirname)
resolve('package.json')
```

```js
const logWithTime = console.log.bind(console, (new Date()).toString())
logWithTime('日志1')
logWithTime('日志2')
logWithTime('日志3')
logWithTime('日志4')
```

## 装饰器 Decorate

- 在原有 API 基础上增加额外的功能

- 不改变底层库的基础上扩展功能的一种模式

### 让函数只被调用一次

```html
<div id="block" class="large">Click Me</div>
<p>文字内容文字内容文字内容文字内容文
  字内容文字内容文字内容文字内容文字内
  容文字内容文字内容文字内容文字内容文字
  内容文字内容文字内容文字内容文字内容文
  字内容文字内容文字内容文字内容文
  字内容文字内容文字内容文字内容文字内
  容文字内容文字内容文字内容文字内容文字
  内容文字内容文字内容文字内容文字内容文
  字内容文字内容文字内容文字内容文
  字内容文字内容文字内容文字内容文字内
  容文字内容文字内容文字内容文字内容文字
  内容文字内容文字内容文字内容文字内容</p>
```

```css
#block {
  float: left;
  color: white;
  text-align: center;
  width: 150px;
  height: 150px;
  line-height: 150px;
  background-color: #37f;
  transition: opacity 2s;
}

#block.hide{
  opacity: 0;
}
```

```js
function once(fn){
  return function(){
    var ret = fn && fn.apply(this, arguments);
    fn = null;
    return ret;
  }
}

block.onclick = once(function(evt){
  console.log('hide');
  evt.target.className = 'hide';
  setTimeout(function(){
    document.body.removeChild(block);
  }, 2000);
});
```

### debounce

```html
<script src="https://s1.ssl.qhres.com/!bd39e7fb/animator-0.2.0.min.js"></script>
<div id="bird" class="sprite bird1"></div>
```

```css
html, body {
  margin:0;
  padding:0;
}

.sprite {
  display:inline-block; overflow:hidden;
  background-repeat: no-repeat;
  background-image:url(https://p1.ssl.qhimg.com/d/inn/0f86ff2a/8PQEganHkhynPxk-CUyDcJEk.png);
}

.bird0 {width:86px; height:60px; background-position: -178px -2px}
.bird1 {width:86px; height:60px; background-position: -90px -2px}
.bird2 {width:86px; height:60px; background-position: -2px -2px}

#bird{
  position: absolute;
  left: 100px;
  top: 100px;
  transform: scale(0.5);
  transform-origin: -50% -50%;
}
```

```js
var i = 0;
setInterval(function(){
  bird.className = "sprite " + 'bird' + ((i++) % 3);
}, 1000/10);

function debounce(fn, delay) {
  delay = delay || 100;
  var timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
       fn.apply(this, arguments);
    }, delay);
  }
}

document.addEventListener('mousemove', debounce(function (evt) {
   var x = evt.clientX,
       y = evt.clientY,
       x0 = bird.offsetLeft,
       y0 = bird.offsetTop;

  var a1 = new Animator(1000, function (ep) {
    bird.style.left = x0 + ep * (x - x0);
    bird.style.top = y0 + ep * (y - y0);
  }, p => p * p);

  a1.animate();
}));
```

## 代理 Proxy

- 保持原有 API 功能不变，改变执行过程和结果

- 不改变底层库的基础上获得不同执行结果的手段

### 拦截异步数据

```js
(function(){
  var open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(){
    var url = arguments[1];
    var serverNameRegex = /^http:\/\/teach.h5jun.com/;
    if(serverNameRegex.test(url)){
      arguments[1] = url.replace(serverNameRegex, "http://localhost:8080");
    }
    return open.apply(this, arguments);
  }
})();

var apiURL = "http://teach.h5jun.com/get_some_data";

var xhr = new XMLHttpRequest();

xhr.open('GET', apiURL);
xhr.send();
```

## 切面 Aspect

- 对代码执行的过程进行监测和修改

- 不改变代码主体执行流程的基础上控制执行过程

系统/环境默认的一些可控制点：

- preventDefault()

- Symbols

### 性能检测

```js
if (performance) {
  performance.watch = function (fn, mark) {
    var idx = 0
    return function () {
      idx++;

      var markStart = mark + idx + '_start',
          markEnd = mark + idx + '_end';

      performance.mark(markStart);
      var ret = fn.apply(this, arguments);

      if (ret instanceof Promise) {
        return ret.then(r => {
          performance.mark(markEnd);
          performance.measure(mark, markStart, markEnd);
          return r;
        })
      } else {
        performance.mark(markEnd);
        performance.measure(mark, markStart, markEnd);
        return ret;
      }
    }
  }
}

var asyncTask = function () {
  return new Promise((resolve) => {
    setTimeout(() => {
       resolve(10)
    }, 1000)
  })
}

asyncTask = performance.watch(asyncTask, 'async-task');

Promise.all([asyncTask(), asyncTask()])
  .then(r => {
  console.log('done', r)
  var measures = performance.getEntriesByType('measure');
  console.log(measures);
})
```

## 总结 Decorate、Proxy 和 Aspect

三者的联系：

- Decorate 强调的是声明和定义
- Proxy 强调的是功能
- Aspect 强调的是运行过程

动态语言可以用 Decorate 来实现 Proxy 和 Aspect

## 懒加载 Lazy load

- 一些加载耗时的资源进行分段、异步加载

- 前端提升性能，减少响应用户的时间

- 某些情况下减少网页流量和带宽消耗

总结：

除了图片以外， JS、CSS 等一切不需要马上执行的资源都可以懒加载，以最大程度提升性能。

## 总结

本质上我们所做的一切都是提升抽象程度和灵活性，从而改善我们的代码质量，降低维护成本。
