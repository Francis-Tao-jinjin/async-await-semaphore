"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Semaphore = void 0;
var SemaphoreNode = (function () {
    function SemaphoreNode(cost, resolve, next, prev) {
        this.cost = cost;
        this.resolve = resolve;
        this.next = next;
        this.prev = prev;
    }
    return SemaphoreNode;
}());
var Semaphore = (function () {
    function Semaphore(counter) {
        if (counter === void 0) { counter = 1; }
        this._head = null;
        this._tail = null;
        this._counter = counter;
    }
    Object.defineProperty(Semaphore.prototype, "counter", {
        get: function () {
            return this._counter;
        },
        enumerable: false,
        configurable: true
    });
    Semaphore.prototype.p = function (I) {
        var _this = this;
        if (I === void 0) { I = 1; }
        return new Promise(function (resolve) {
            if (I <= _this.counter) {
                _this._counter -= I;
                return resolve();
            }
            else {
                var tail = _this._tail;
                var node = new SemaphoreNode(I, resolve, null, tail);
                if (tail) {
                    tail.next = node;
                }
                else {
                    _this._head = node;
                }
                _this._tail = node;
            }
        });
    };
    Semaphore.prototype.v = function (I) {
        if (I === void 0) { I = 1; }
        this._counter += I;
        for (var node = this._head; !!node && this.counter > 0;) {
            var next = node.next, prev = node.prev, cost = node.cost, resolve = node.resolve;
            if (cost <= this._counter) {
                this._counter -= cost;
                if (!prev) {
                    this._head = next;
                }
                else {
                    prev.next = next;
                }
                if (!next) {
                    this._tail = prev;
                }
                else {
                    next.prev = prev;
                }
                node.next = node.prev = null;
                resolve();
            }
            node = next;
        }
    };
    return Semaphore;
}());
exports.Semaphore = Semaphore;
//# sourceMappingURL=index.js.map