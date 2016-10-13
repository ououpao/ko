import Watcher from './watcher'
import { isNumber } from './util'

const oprationReg = /([\+|-|\*|\/|%]\s*)(\b\w+\b)/g
  // 表达式中允许的关键字
var allowKeywords = 'Math.parseInt.parseFloat.Date.this.true.false.null.undefined.Infinity.NaN.isNaN.isFinite.decodeURI.decodeURIComponent.encodeURI.encodeURIComponent';
var regAllowKeyword = new RegExp('^(' + allowKeywords.replace(/\./g, '\\b|') + '\\b)');

// 表达式中禁止的关键字
var avoidKeywords = 'var.const.let.if.else.for.in.continue.switch.case.break.default.function.return.do.while.delete.try.catch.throw.finally.with.import.export.instanceof.yield.await';
var regAviodKeyword = new RegExp('^(' + avoidKeywords.replace(/\./g, '\\b|') + '\\b)');

// 匹配常量缓存序号 "1"
var regSaveConst = /"(\d+)"/g;
// 只含有 true 或 false
var regBool = /^(true|false)$/;
// 匹配表达式中的常量
var regReplaceConst = /[\{,]\s*[\w\$_]+\s*:|('[^']*'|"[^"]*")|typeof /g;
// 匹配表达式中的取值域
var regReplaceScope = /[^\w$\.]([A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\])*)/g;
// 匹配常规取值: item or item['x'] or item["y"] or item[0]
var regNormal = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;

/**
 * 是否是常规指令表达式
 * @param   {String}   expression
 * @return  {Boolean}
 */
function isNormal(expression) {
  return regNormal.test(expression) && !regBool.test(expression) && expression.indexOf('Math.') !== 0;
}

// 保存常量，返回序号 "i"
var consts = [];

function saveConst(string) {
  var i = consts.length;
  consts[i] = string;
  return '"' + i + '"';
}

/**
 * 返回替换之前的常量
 * @param   {Strinf}  string
 * @param   {Number}  i
 * @return  {String}
 */
function returnConst(string, i) {
  return consts[i];
}

/**
 * 返回表达式的 scope 替换
 * @param   {String}  string
 * @return  {String}
 */
function replaceScope(string) {
  var pad = string.charAt(0);
  var path = string.slice(1);

  if (regAllowKeyword.test(path)) {
    return string;
  } else {
    path = path.indexOf('"') !== -1 ? path.replace(regSaveConst, returnConst) : path;
    return pad + 'scope.' + path;
  }
}

export default class Parser {
  constructor(vm) {
    this.vm = vm
  }

  bind(exp) {
    this.exp = exp
    this.getter = this.createGetter(exp)
    this.watcher = new Watcher(this.vm, this.getter, this.update.bind(this))
    this.update(this.watcher.value)
    this.vm._watchers.push(this.watcher)
  }

  createGetter(exp) {
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
      return getter(this.vm._data)
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
