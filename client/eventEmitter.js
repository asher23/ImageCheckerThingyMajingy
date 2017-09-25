class EventEmitter {
    constructor() {
        this.subscribers = {};
    }

    on(eventName, eventListener) {
        this.subscribers[eventName] = this.subscribers[eventName] || [];
        this.subscribers[eventName].push(eventListener);  
    }

    emit(eventName, ...remainingArgs) {
        if (!this.subscribers[eventName]) {
            return;
        }

        this.subscribers[eventName].forEach(listener => listener.apply(null, remainingArgs));

    }
    
}


export default EventEmitter