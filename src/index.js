import * as util from './util'

class Kite {
  constructor(options) {
    this.$options = Object.assign({}, options)

    this.$el = util.query(this.$options.el)

    this.$data = this.$options.data()

    this.$unCompileNode = []

    this.init()
  }

  init() {
  	this.$fragment = util.nodeToFragment(this.$el)
    this.compile(this.$fragment, true)
    this.mount()
  }

  compile(el, isRoot) {
    let childNodes = el.childNodes
    let node
    let attrs
    for (let i = 0, len = childNodes.length; i < len; i++) {
      node = childNodes[i]
      if (node.nodeType != 1) {
        continue
      }
      this.$unCompileNode.push({
        attrs: this.getAttrs(node),
        node: node
      })
      if (node.hasChildNodes) {
        this.compile(node)
      }
    }
    if (isRoot) {
      this.compileAll()
    }
  }

  compileAll() {
    this.$unCompileNode.forEach((node, index) => {
      this.compileNode(node)
    })
  }

  compileNode(node) {
    let currentNode = node.node
    node.attrs.forEach((attr, index) => {
      this.parser(attr, currentNode)
    })
  }

  parser(attr, node) {
    let directve = attr.name
    let value = attr.value

    let vm = this.$data
    this.getter = new Function('scope', `return scope.${value}`)

    this.update(node, this.getter(vm))

    this.observer(vm, value, node)
  }

  observer(vm, key, node) {
    Object.defineProperty(vm, key, {
      get() {
        return this.getter(vm)
      },
      set(newValue) {
        this.update(node, newValue)
      }
    })
  }

  update(node, value) {
  	node.textContent = value
  }

  getAttrs(el) {
    let attrs = el.attributes
    let result = []
    for (let i = 0, len = attrs.length; i < len; i++) {
      let attr = attrs[i]
      result.push({
        name: attr.name,
        value: attr.value
      })
    }
    return result
  }

  mount() {
    this.$el.appendChild(this.$fragment)
  }

}

export default Kite
