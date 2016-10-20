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
    this.update()
    Dep.target = null
  }
  update() {
    try {
      this.value = this.getter()
    }catch(err) {
      console.error(`Error when evaluating expression "${this.exp}":${err}`)
    }
    this.cb(this.value)
  }
}
