import {
  getAttrs,
  nodeToFragment,
  isNodeType,
  isTextType
} from './util'
import parsers from './directives'

function isDirective(name) {
  return name.indexOf('k-') > -1
}

function getDirectves(attrs) {
  let name, exp, result = []
  attrs.forEach((attr) => {
    name = attr.name
    exp = attr.value
    if (isDirective(name)) {
      name = formateDirectiveName(name)
      result.push({
        exp,
        name
      })
    }
  })
  return result
}

function formateDirectiveName(name) {
  return name.replace(/k-/, '')
}

export default class Compile {
  constructor(vm, el) {
    this.vm = vm
    this._unCompileNodes = []
    this._fragment = nodeToFragment(el)
    this.init()
  }

  init() {
    this.scanElement(this._fragment)
    this.compileNodes(this._unCompileNodes)
  }

  // todo
  scanElement(el) {
    const childNodes = el.childNodes
    let node, attrs, directves, nodeType, i = childNodes.length

    while (i--) {
      node = childNodes[i]
      if (isNodeType(node)) {
        attrs = getAttrs(node)
        directves = getDirectves(attrs)
        if (directves.length) {
          this._unCompileNodes.push({
            node,
            directves
          })
        }
        if (node.hasChildNodes()) {
          this.scanElement(node)
        }
      } else if (isTextType(node)) {
        this.compileText()
      }
    }
  }

  compileNodes(nodes) {
    nodes.forEach(item => {
      this.compileDirective(item.directves, item.node)
    })
  }

  compileText(node) {

  }

  compileDirective(directves, node) {
    directves.forEach(directve => {
      const Parser = parsers[directve.name]
      if (Parser) {
        new Parser(this.vm, directve.exp, node)
      }
    })
  }
}
