# async-await-semaphore

a semaphore provide two operations, historically denoted as P and V. Operation V increments the counter of a semaphore, and operation P decrements it.

## API

### new Semaphore(count:number = 1)

create a semaphore

```javascript
import {Semaphore} from 'async await-semaphore';

const semaphore = new Semaphore();
```

### semaphore.p(I:number = 1)
P operation
```javascript
const semaphore = new Semaphore(0);
let started = 0;
let finished = 0;
async function thread() {
    started += 1;
    await semaphore.p(2);
    finished += 1;
}
thread();
console.log(started);   // 1
console.log(finished);  // 0
```

### semaphore.v(I:number = 1)
V operation
```javascript
const semaphore = new Semaphore(0);
let started = 0;
let finished = 0;
async function thread() {
    started += 1;
    await semaphore.p(2);
    finished += 1;
}
thread();
console.log(started);   // 1
console.log(finished);  // 0

semaphore.v(2);
await sleep(10);
console.log(started);   // 1
console.log(finished);  // 1
```