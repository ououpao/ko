export function query(el) {
  if (el && !el.nodeType) {
    el = document.querySelector(el)
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
