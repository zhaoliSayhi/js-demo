export default class Event {
  constructor(msgQueues) {
    this.msgQueues = msgQueues;
  }
  on(msgName, func) {
    if (this.msgQueues.hasOwnProperty(msgName)) {
      if (typeof this.msgQueues === "function") this.msgQueues[msgName] = [this.msgQueues[msgName], func];
      else this.msgQueues[msgName] = [...this.msgQueues[msgName], func];
    } else {
      this.msgQueues[msgName] = func;
    }
  }

  one(msgName, func) {
    this.msgQueues[msgName] = func;
  }

  emit(msgName, msg) {
    if (!this.msgQueues.hasOwnProperty(msgName)) return;
    if (typeof this.msgQueues[msgName] === 'function') {
      this.msgQueues[msgName](msg);
    }
    else {
      this.msgQueues[msgName].map(fn => {
        fn(msg);
      });
    }
  }

  off(msgName) {
    if (!this.msgQueues.hasOwnProperty(msgName)) return;
    delete this.msgQueues[msgName];
  }
}
