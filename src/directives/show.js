import Parser from '../parser'

export default class ShowParser extends Parser {
  constructor(...args) {
    super(args)
    this.init()
  }
  init() {
    this.bind(this.exp)
  }
  update(newValue) {
    this.node.style.display = newValue ? 'block' : 'none'
  }
}
