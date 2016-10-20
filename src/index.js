import { query } from './util'
import parsers from './parser'
import observer from './observer'
import Compiler from './compiler'

class Korol {
  constructor(options) {
    this._options = Object.assign({}, options)

    this._el = query(this._options.el)

    this._data = this._options.data

    this._watchers = []

    this.init()
  }

  init() {
    this.initData()
    this.mount(this._el)
  }

  initData() {
    observer(this._data)
  }

  mount(el) {
    const compiler = new Compiler(this, el)
    this._el.appendChild(compiler._fragment)
  }
}

export default Korol
