import Parser from '../parser'

export default class OnParser extends Parser {
  constructor(...args) {
    super(args)
    this.event = this.params[0]
    this.init()
  }
  init() {
    this.bind(this.exp)
  }

  bindEvent(listener) {
    this.node.addEventListener(this.event, function(evt) {
      listener(evt)
    })
  }

  update(listener) {
    this.bindEvent(listener)
  }
}
