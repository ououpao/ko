import Watcher from '../watcher'

export default class vText {
  constructor(vm, exp, node) {
    this.vm = vm
    this.exp = exp
    this.node = node
    this.init()
  }
  init() {
    this.watcher = new Watcher(this.vm, this.exp, this.update, this)
    this.update(this.watcher.value)
    this.vm._watchers.push(this.watcher)
  }
  update(newValue) {
    this.node.textContent = newValue
  }
}
