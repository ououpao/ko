import Dep from './dep'
export default class Watcher {
  constructor(vm, exp, cb, context) {
    this.vm = vm
    this.exp = exp
    this.cb = cb
    this.context = context
    this.value = null
    this.getter = null
    this.init()
  }
  init() {
    Dep.target = this
    this.getter = new Function('scope', `return scope.${this.exp}`)
    this.setValue()
    Dep.target = null
  }
  update() {
    this.setValue()
    this.cb.call(this.context, this.value)
  }
  setValue() {
    this.value = this.getter(this.vm._data)
  }
}
