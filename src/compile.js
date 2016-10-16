import {
  getAttrsArray,
  nodeToFragment,
  isNodeType,
  isTextType
} from './util'
import Directives from './directives'

const mustacheReg = /(\{\{.*\}\})|(\{\{\{.*\}\}\})/
const singleMustacheReg = /\{\{|\}\}|\{\{\{|\}\}\}/g
const splitExpReg = /(\{\{[^\}\}]+\}\})/

function isDirective(name) {
  return name.indexOf('k-') > -1
}

function getDirectives(node) {
  let attrs = getAttrsArray(node)
  let name, expression, directives = []
  attrs.forEach((attr) => {
    name = attr.name
    expression = attr.value
    if (isDirective(name)) {
      name = name.replace(/k-/, '')
      directives.push({
        name,
        expression
      })
    }
  })
  return directives
}

function hasDirective(node) {
  let attrs, i, text = node.textContent
  if (isNodeType(node)) {
    attrs = node.attributes
    i = attrs.length
    while (i--) {
      if (isDirective(attrs[i].name)) {
        return true
      }
    }
  } else if (isTextType(node)) {
    return mustacheReg.test(text)
  }
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

  scanElement(el) {
    const childNodes = el.childNodes
    let node, i = childNodes.length

    while (i--) {
      node = childNodes[i]
      if (hasDirective(node)) {
        this._unCompileNodes.push(node)
      }
      if (node.hasChildNodes()) {
        this.scanElement(node)
      }
    }
  }

  compileNodes(nodes) {
    nodes.forEach(node => {
      if (isNodeType(node)) {
        this.compileDirective(node)
      } else if (isTextType(node)) {
        this.compileText(node)
      }
    })
  }

  // static {{exp}} static => 'static' + (exp) + 'static'
  compileText(node) {
    const textContent = node.textContent
    let clips = textContent.split(splitExpReg)
    let expression, expressionClips
    expressionClips = clips.map((clip) => {
      if (mustacheReg.test(clip)) {
        clip = clip.replace(singleMustacheReg, '')
        return clip
      } else {
        return `'${clip}'`
      }
    })
    expression = expressionClips.join('+')
    new Directives.text(this.vm, expression, node)
  }

  compileDirective(node) {
    let directves = getDirectives(node)
    directves.forEach(directve => {
      const Directive = Directives[directve.name]
      if (Directive) {
        new Directive(this.vm, directve.expression, node)
      }
    })
  }
}
