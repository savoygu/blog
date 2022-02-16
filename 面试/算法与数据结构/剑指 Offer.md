## 剑指 Offer

> [剑指 Offer](https://leetcode-cn.com/study-plan/lcof/?progress=v67jfdj)

### 第一天 栈与队列（简单）

#### [剑指 Offer 09. 用两个栈实现队列](https://leetcode-cn.com/problems/yong-liang-ge-zhan-shi-xian-dui-lie-lcof/)

用两个栈实现一个队列。队列的声明如下，请实现它的两个函数 appendTail 和 deleteHead ，分别完成在队列尾部插入整数和在队列头部删除整数的功能。(若队列中没有元素，deleteHead 操作返回 -1 )

**思路**：明确要求使用栈，只能借助 push 、pop 方法来做。

对于队列的 `appendTail` 追加元素，与栈一致，直接 push 即可；

对于队列的 `deleteHead` 删除元素，需要借助“辅助栈”，通过把“主栈”元素出栈并利用“辅助栈”入栈实现元素的倒序存储，这样的话只需删除辅助栈栈顶元素即可，当“主栈”和“辅助栈”都为空时，返回 -1。

#### [剑指 Offer 30. 包含 min 函数的栈](https://leetcode-cn.com/problems/bao-han-minhan-shu-de-zhan-lcof/)

定义栈的数据结构，请在该类型中实现一个能够得到栈的最小元素的 min 函数在该栈中，调用 min、push 及 pop 的时间复杂度都是 O(1)。

**思路**：明确要求使用栈，这里需要借助“辅助栈”来做。

定义一个“主栈”来存储所有元素，“最小栈”用来存储“非严格递减的元素”。

对于 `push` ，“主栈”直接入栈，而“最小栈”需要与栈顶元素对比满足非严格递减条件，才会入栈；

对于 `pop`，“主栈”直接出栈，而“最小栈”需要用栈顶元素与“出栈”元素相等才能出栈；

对于 `min`，直接返回 “最小栈”栈顶元素。

### 第二天链表（简单）

#### [剑指 Offer 06. 从尾到头打印链表](https://leetcode-cn.com/problems/cong-wei-dao-tou-da-yin-lian-biao-lcof/)

输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。

#### [剑指 Offer 24. 反转链表](https://leetcode-cn.com/problems/fan-zhuan-lian-biao-lcof/)

定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。

**示例:**

```
输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
```

思路：

迭代：需要用双指针，一个表示“已反转”的头结点（prev），一个表示“待反转”的头结点（curr），反转时，让“待反转”的指针后移表示“下次待反转”的头结点（next，占位）， 然后让“待反转”的 （curr.next）指向“已反转”的头结点（prev），最后让“已反转”的（prev）移动到（curr），把（curr）移动到（next），直到 （curr）为 null 。

递归：首先保证当前节点及其 next 节点不为空，然后不断地把当前节点的 next 向递归函数中传，直到最后一个节点，而最后一个节点就是反转后的头结点，层层返回即可。在每次循环中，需要反转当前节点与其 next 节点的指向关系，把当前节点的 next 的 next 指向当前节点（也就是 next 节点的 next 指向当前节点），同时把当前节点的 next 指向 null 移除之前的指向关系。
