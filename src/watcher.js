import Dep from './dep'

export default class Watcher {
  constructor(vm, getter, cb, context) {
    this.vm = vm
    this.getter = getter
    this.cb = cb
    this.init()
  }
  init() {
    Dep.target = this
    this.update()
    Dep.target = null
  }
  update() {
    this.value = this.getter()
    this.cb(this.value)
  }
}
