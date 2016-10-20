import Parser from '../parser'
import { each, def, createFragment } from '../util'

const forExpReg = /(.*)\s+in\s+(.*)/

export default class ForParser extends Parser {
  constructor(vm, exp, node, scope) {
    super(vm)
    this.exp = exp
    this.node = node
    this.$parent = node.parentNode
    this.$next = node.nextSibling
    this.scope = scope
    this.init()
  }

  init() {
    this.parse()
  }

  parse() {
    const scope = this.scope || this.vm._data
    const matchs = this.exp.match(forExpReg)
    const alias = matchs[1]
    const iterator = matchs[2]
    const iteratorGetter = this.createGetter(iterator, scope)
    const dataList = iteratorGetter()
    const listFragment = createFragment()
    each(dataList, (data, i, list) => {
      const $scope = Object.create(scope)
      const el = this.node.cloneNode(true)
      def($scope, alias, data)
      el.removeAttribute('k-for')
      this.vm._compiler.compile(el, true, $scope)
      listFragment.appendChild(el)
    })
    this.$parent.insertBefore(listFragment, this.$next)
    this.$parent.removeChild(this.node)
  }

  update(newValue) {
    this.node.textContent = newValue
  }
}
