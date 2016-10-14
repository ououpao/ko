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

export function nodeToFragment(node) {
  let fragment = document.createDocumentFragment()
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

export function getAttrs(node) {
  const attrs = node.attributes || []
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
