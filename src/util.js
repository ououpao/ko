export function query(el) {
  if (typeof el === 'string') {
    let selector = el
    el = document.querySelector(el)
    if (!el) {
      throw new Error(`Cannot find element: ${selector}`)
    }
  }
  return el
}

export function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isFunction(obj) {
  return Object.prototype.toString.call(obj) === '[object Function]'
}

export function each(obj, callback) {
  if (!obj) return
  if (isArray(obj)) {
    obj.forEach(function(item, index, arry) {
      callback(item, index, arry)
    })
  } else if (isObject(obj)) {
    let keys = Object.keys(obj)
    kes.forEach(function(key) {
      callback(obj[key], key, obj)
    })
  } else if (obj.length) {
    let len = obj.length
    while (len--) {
      callback(obj[len], len, obj)
    }
  }
}

export function createFragment() {
  return document.createDocumentFragment()
}
export function nodeToFragment(node) {
  let fragment = createFragment()
  let child
  while (child = node.firstChild) {
    fragment.appendChild(child)
  }
  return fragment;
}

export function isPlainObject(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return true
    }
  }
}

export function getAttrsArray(node) {
  const attrs = node.attributes
  let attr, i = attrs.length
  let result = []
  while (i--) {
    attr = attrs[i]
    result.push({
      name: attr.name,
      value: attr.value
    })
  }
  return result
}

export function hasAttr(node, name) {
  const attrs = node.attributes
  let flag
  each(attrs, function(attr) {
    if (attr.name == name) {
      flag = true
    }
  })
  return flag
}

export function isNumber(number) {
  number = Number(number)
  return !isNaN(number) && typeof number === 'number'
}

export function isNodeType(node) {
  return node && node.nodeType == 1
}

export function isTextType(node) {
  return node && node.nodeType == 3
}

export function def(obj, property, value) {
  Object.defineProperty(obj, property, {
    enumerable: true,
    value: value
  })
}
