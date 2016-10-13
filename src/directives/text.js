import Parser from '../parser'

export default class TextParser extends Parser {
  constructor(vm, exp, node) {
    super(vm)
    this.exp = exp
    this.node = node
    this.init()
  }
  init() {
    this.bind(this.exp)
  }
  update(newValue) {
    this.node.textContent = newValue
  }
}
