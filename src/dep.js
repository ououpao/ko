export default class Dep {
	constructor() {
		this.subs = []
	}
	addSub(watcher) {
		this.subs.push(watcher)
	}
	notify(newVal, oldVal) {
		this.subs.forEach(watcher => {
			watcher.update(newVal, oldVal)
		})
	}
}

Dep.target = null