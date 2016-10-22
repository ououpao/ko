import Parser from '../parser'

export default class OnParser extends Parser {
  constructor(...args) {
    super(args)
    this.event = this.params[0]
    this.init()
  }
  init() {
    this.bind(this.exp)
    this.bindEvent()
  }

  bindEvent() {
    const listener = this.watcher.value.bind(this.vm._data)
    this.node.addEventListener(this.event, function(evt) {
      listener(evt)
    })
  }

  update() {

  }
}
