import Dep from './dep'

export default class Watcher {
  constructor(vm, exp, getter, cb, context) {
    this.vm = vm
    this.exp = exp
    this.getter = getter
    this.cb = cb
    this.init()
  }

  init() {
    Dep.target = this
    this.setValue()
    this.update(this.value)
    Dep.target = null
  }

  setValue() {
    try {
      this.value = this.getter()
    } catch (err) {
      console.error(`Error when evaluating expression "${this.exp}":${err}`)
    }
  }

  update(newValue, oldValue) {
    this.cb(newValue, oldValue)
  }
}
