class Scheduler {
  constructor() {
    this.task = []
    this.curringRuning = 0
  }

  add(promiseCreator) {
    return new Promise((resolve, reject) => {
      this.task.push(() => promiseCreator().then(() => resolve()))
      // 控制最多执行两个
      if (this.curringRuning < 2) this.doTask()
    })
  }

  doTask() {
    if (this.task.length > 0) {
      const runTask = this.task.shift()
      this.curringRuning++
      runTask().then(() => { // 完成 1 个后，开始下一个，保证最多执行 2 个
        this.curringRuning--
        this.doTask()
      })
    }
  }
}

module.exports = Scheduler
