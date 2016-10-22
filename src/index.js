import { query, isFunction } from './util'
import parsers from './parser'
import observer from './observer'
import Compiler from './compiler'

export default class Ko {
  constructor(options) {
    this._options = Object.assign({}, options)

    this._el = query(this._options.el)

    this._data = this._options.data

    this._watchers = []

    this.init()
  }

  init() {
    this.proxMethods()
    this.initData()
    this.mount(this._el)
  }

  proxMethods() {
    const methods = this._options.methods
    let keys, key, fn, i
    if (methods) {
      keys = Object.keys(methods)
      i = keys.length
      while (i--) {
        key = keys[i]
        fn = methods[key]
        if (isFunction(fn))
          this._data[key] = fn.bind(this._data)
      }
    }
  }

  initData() {
    observer(this._data)
  }

  mount(el) {
    const compiler = new Compiler(this, el)
    this._el.appendChild(compiler._fragment)
  }
}
