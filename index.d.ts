export declare class Semaphore {
    private _head;
    private _tail;
    private _counter;
    constructor(counter?: number);
    get counter(): number;
    p(I?: number): Promise<void>;
    v(I?: number): void;
}
