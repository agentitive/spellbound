import { EventEmitter } from "events"


export class MessagePipe {
    // event that we can fire with .on('message', (message) => {}) etc
    protected incoming: EventEmitter

    constructor(
        protected outgoing: (message: any) => Thenable<any>,
    ){ 
        this.incoming = new EventEmitter();
    }

    async send(message: any) {
        return this.outgoing(message);
    }

    async receive(message: any) {
        return this.incoming.emit('message', message);
    }

    subscribe(listener: (...args: any[]) => void) {
        return this.incoming.on('message', listener);
    }
}