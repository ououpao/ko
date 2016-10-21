import Parser from '../parser'
import { isNodeType } from '../util'

export default class TextParser extends Parser {
  constructor(vm, exp, node, scope) {
    super(vm)
    this.exp = exp
    this.node = node
    this.scope = scope
    this.init()
  }
  init() {
    if (isNodeType(this.node)) {
      this.node.removeAttribute('k-text')
    }
    this.bind(this.exp)
  }
  update(newValue) {
    this.node.textContent = newValue
  }
}
