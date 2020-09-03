class SemaphoreNode {
    constructor(
        public cost:number,
        public resolve:() => void,
        public next:SemaphoreNode|null,
        public prev:SemaphoreNode|null)  {}
}

export class Semaphore {
    private _head:SemaphoreNode|null = null;
    private _tail:SemaphoreNode|null = null;
    private _counter:number;
    constructor (counter:number = 1) {
        this._counter = counter;
    }
    get counter () {
        return this._counter;
    }

    public p(I:number = 1) : Promise<void> {
        return new Promise((resolve) => {
            if (I <= this.counter) {
                this._counter -= I;
                return resolve();
            } else {
                const tail = this._tail;
                const node = new SemaphoreNode(I, resolve, null, tail);
                if (tail) {
                    tail.next = node;
                } else {
                    this._head = node;
                }
                this._tail = node;
            }
        });
    }

    public v(I:number = 1) {
        this._counter += I;
        for (let node = this._head; !!node && this.counter > 0;) {
            const { next, prev, cost, resolve } = node;
            if (cost <= this._counter) {
                this._counter -= cost;
                if (!prev) {
                    this._head = next;
                } else {
                    prev.next = next;
                }
                if (!next) {
                    this._tail = prev;
                } else {
                    next.prev = prev;
                }
                node.next = node.prev = null;
                resolve();
            }
            node = next;
        }
    }
}