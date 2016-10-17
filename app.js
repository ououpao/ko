import Ko from './src/index'

if (module.hot) {
  module.hot.accept();
}
window.data = {
	first: 'Liao',
  name: 'jingsi',
  nickName: 'kraaas',
  github: 'github.com/kraaas',
  age: 23,
  job: {
    name: '前端开发工程师',
    year: 1
  },
  company: 'Qingsongxing'
}
window.Ko = new Ko({
  el: '#app',
  data: data
})
