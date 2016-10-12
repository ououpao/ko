import directives from './directives'
import { isNumber } from './util'

const oprationReg = /([\+|-|\*|\/|%]\s*)(\b\w+\b)/g

export default class Parser {
  constructor(vm) {
    debugger;
    this.vm = vm
  }

  bind(exp) {
    this.getter = createGetter(exp)
    this.watcher = new Watcher(this.vm, this.getter, this.update.bind(this))
    this.update(this.watcher.value)
    this.vm._watchers.push(this.watcher)
  }
}

function createGetter(exp) {
  let getter
  exp = exp.replace(oprationReg, (str, oprate, oprater) => {
    let result
    if (oprater && isNumber(oprater)) {
      result = str
    } else {
      result = `${oprate}scope.${oprater}`
    }
    return result
  })
  try {
    getter = new Function('scope', `return scope.${exp}`)
  } catch (err) {
    console.error(err)
  }
  return () => {
    getter(this.vm._data)
  }
}

function noop() {}
