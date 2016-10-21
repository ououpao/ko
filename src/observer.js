import Dep from './dep'

class Observer {
  constructor(model) {
    this.model = model
    this.defineProperty(model)
  }

  defineProperty(model) {
    const keys = Object.keys(model)
    keys.forEach(key => this.decorate(model, key, model[key]))
  }
  
  decorate(obj, key, val) {
    let dep = new Dep()
    observe(val)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        if (Dep.target) {
          dep.addSub(Dep.target)
        }
        return val
      },
      set(newVal) {
        const oldVal = val
        if (newVal == val) return
        val = newVal
        observe(newVal)
        dep.notify(newVal, oldVal)
      }
    })
  }
}

export default function observe(model, vm) {
  if (!model || typeof model !== 'object') {
    return
  }
  return new Observer(model)
}
