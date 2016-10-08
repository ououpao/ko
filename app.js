import Kite from './src/index'
if (module.hot) {
  module.hot.accept();
}
window.data = {
  name: 'kraaas',
  age: 23,
  job: {
  	year: 1
  }
}
new Kite({
  el: '#app',
  data() {
    return data
  }
})
