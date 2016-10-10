import directives from './directives'

export default class Parser {
  constructor(vm) {
    this.vm = vm
  }

  parse(directive, node) {
    const name = directive.name
    const exp = directive.exp
    const subParser = directives[name]
    if(subParser) {
    	new subParser(this.vm, exp, node)
    }
  }
}
