import Parser from '../parser'

export default class TextParser extends Parser {
  constructor(vm, exp, node, scope) {
    super(vm)
    this.exp = exp
    this.node = node
    this.scope = scope
    this.init()
  }
  init() {
    this.bind(this.exp)
  }
  update(newValue) {
    this.node.textContent = newValue
  }
}
