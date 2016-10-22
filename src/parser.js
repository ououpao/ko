import Watcher from './watcher'
import { isNumber } from './util'

// 表达式中允许的关键字
const allowKeywords = 'Math.parseInt.parseFloat.Date.this.true.false.null.undefined.Infinity.NaN.isNaN.isFinite.decodeURI.decodeURIComponent.encodeURI.encodeURIComponent';
const regAllowKeyword = new RegExp('^(' + allowKeywords.replace(/\./g, '\\b|') + '\\b)');

// 表达式中禁止的关键字
const avoidKeywords = 'var.const.let.if.else.for.in.continue.switch.case.break.default.function.return.do.while.delete.try.catch.throw.finally.with.import.export.instanceof.yield.await';
const regAviodKeyword = new RegExp('^(' + avoidKeywords.replace(/\./g, '\\b|') + '\\b)');

// 匹配常量缓存序号 "1"
const regSaveConst = /"(\d+)"/g;
// 只含有 true 或 false
const regBool = /^(true|false)$/;
// 匹配表达式中的常量
const regReplaceConst = /[\{,]\s*[\w\$_]+\s*:|('[^']*'|"[^"]*")|typeof /g;
// 匹配表达式中的取值域
const regReplaceScope = /[^\w$\.]([A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\])*)/g;
// 匹配常规取值: item or item['x'] or item["y"] or item[0]
const regNormal = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;

function isNormal(expression) {
  return regNormal.test(expression) && !regBool.test(expression) && expression.indexOf('Math.') !== 0;
}

// 保存常量，返回序号 "i"
let consts = [];

function saveConst(string) {
  let i = consts.length;
  consts[i] = string;
  return '"' + i + '"';
}

function returnConst(string, i) {
  return consts[i];
}

function replaceScope(string) {
  let pad = string.charAt(0);
  let path = string.slice(1);

  if (regAllowKeyword.test(path)) {
    return string;
  } else {
    path = path.indexOf('"') !== -1 ? path.replace(regSaveConst, returnConst) : path;
    return pad + 'scope.' + path;
  }
}

export default class Parser {
  constructor([vm, node, scope, exp, params]) {
    this.vm = vm
    this.exp = exp
    this.node = node
    this.scope = scope
    this.params = params
  }

  bind(exp) {
    this.exp = exp
    this.getter = this.createGetter(exp, this.scope || this.vm._data)
    this.watcher = new Watcher(this.vm, this.exp, this.getter, this.update.bind(this))
    this.vm._watchers.push(this.watcher)
  }

  createGetter(exp, scope) {
    let getter
    exp = this.bindScope(exp);

    if (regAviodKeyword.test(exp)) {
      console.error('Avoid using unallow keyword in expression: ' + this.exp);
      return;
    }

    try {
      getter = new Function('scope', `return ${exp}`)
    } catch (err) {
      getter = function() {}
      console.error(`Invalid generated expression: ${this.exp}`)
    }

    return () => {
      return getter(scope)
    }
  }

  bindScope(exp) {
    if (isNormal(exp)) {
      return 'scope.' + exp;
    }

    exp = (' ' + exp).replace(regReplaceConst, saveConst);
    exp = exp.replace(regReplaceScope, replaceScope);
    exp = exp.replace(regSaveConst, returnConst);

    return exp;
  }

}
