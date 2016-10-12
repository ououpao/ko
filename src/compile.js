import { getAttrs, nodeToFragment } from './util'
import parsers from './directives'

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

  scanElement(el) {
    const childNodes = el.childNodes
    let node, attrs, directves, i = childNodes.length

    while (i--) {
      node = childNodes[i]
      attrs = getAttrs(node)
      if (node.nodeType == 1) {
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
      }
    }
  }

  compileNodes(nodes) {
    nodes.forEach(item => {
      this.compileDirective(item.directves, item.node)
    })
  }

  compileDirective(directves, node) {
    directves.forEach(directve => {
      const Parser = parsers[directve.name]
      if(Parser) {
        new Parser(this.vm, directve.exp, node)
      }
    })
  }
}


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
