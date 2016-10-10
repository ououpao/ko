import Kite from './src/index'

if (module.hot) {
  module.hot.accept();
}
window.data = {
	first: 'Liao',
  name: 'jingsi',
  age: 23,
  job: {
    name: '前端开发工程师',
    year: 1
  }
}
window.kite = new Kite({
  el: '#app',
  data: data
})
