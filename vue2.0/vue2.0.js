function defineReactive(data, key, value) {
    var dep = new Dep();
    observe(value);
    Object.defineProperty(data, key, {
        get: function () {
            dep.depend();
            return value;
        },
        set: function (newVal) {
            if (newVal === value) return;
            value = newVal;
            dep.notify();
        }
    })
}


// 实现一个监听器 Observer 用来劫持并监听所有的属性，如果有变动就通知订阅者
function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    Object.keys(data).forEach(function (key) {
        defineReactive(data, key, data[key]);
    })
}

// 在数据被读或写的时候通知那些依赖该数据的视图更新了
// 发布订阅者模式，数据变化为发布者，依赖的对象为订阅者
// 依赖收集的容器，收集这些订阅者 然后在数据变化的时候执行对应的订阅者函数 watcher
function Dep() {
    this.subs = [];
}

Dep.prototype = {
    // 添加订阅者
    addSub: function (sub) {
        this.subs.push(sub);
    },

    // 判断是否增加订阅者
    depend: function () {
        if (Dep.target) {
            this.addSub(Dep.target);
        }
    },

    // 通知订阅者更新
    notify: function () {
        this.subs.forEach(function (sub) {
            sub.update();
        })
    }
}

Dep.target = null;  //  target 静态属性，全局唯一的 watcher

// 实现一个订阅者 wathcher 可以收到属性的变化通知并执行相应的函数，从而更新视图
/**
 *
 * @param vm 一个 vue 的实例对象
 * @param exp node 节点的 v-model, v-onclick 等指令的属性值 如 v-model="name", exp 就是 name
 * @param cb watcher 绑定的更新函数
 * @constructor
 */
function Watcher (vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.value = this.get();
}

Watcher.prototype = {
    update: function () {
        let value = this.vm.data[this.exp];
        let oldValue = this.value;

        if (value !== oldValue) {
            this.value = value;
            this.cb.call(this.vm, value, oldValue);
        }
    },

    get: function () {
        Dep.target = this; // 缓存自己
        let value = this.vm.data[this.exp]; // 强制执行监听器里的 get 函数
        Dep.target = null; // 释放自己
        return value;
    },


}

// 实现一个解析器 Compile 扫描和解析每个节点的相关指令
function compile() {

}
