import tape = require('tape');
import { Semaphore } from './src';

async function sleep (ms:number) {
    await new Promise((resolve) => {
        setTimeout( resolve, ms);
    });
}

tape('semaphore mutex', async (t) => {
    const semaphore = new Semaphore();
    let mutex = false;

    async function thread () {
        for (let i = 0; i < 10; i++) {
            await sleep(10 * Math.random());
            await semaphore.p();
            t.equals(mutex, false, i + ' avaliable');
            mutex = true;
            await sleep(10 * Math.random());
            mutex = false;
            semaphore.v();
        }
    }
    const threads:Promise<void>[] = [];
    for (let i = 0; i < 5; i++) {
        threads.push(thread());
    }
    await Promise.all(threads);

    t.end();
});

tape('semaphore gate', async (t) => {
    const semaphore = new Semaphore(0);
    let started = 0;
    let finished = 0;

    async function thread() {
        started += 1;
        await semaphore.p(2);
        finished += 1;
    }

    const threads:Promise<void>[] = [];
    for (let i = 0; i < 10; i++) {
        threads.push(thread());
    }

    await sleep(10);
    t.equals(started, 10, 'started 10 threads');
    t.equals(finished, 0, 'no thread has through gate');

    semaphore.v(1);
    await sleep(10);
    t.equals(finished, 0, 'no thread has through gate');

    semaphore.v(1);
    await sleep(10);
    t.equals(finished, 1, '1 thread has through gate');

    semaphore.v(10);
    await sleep(10);
    t.equals(finished, 6, '6 thread has through gate');

    semaphore.v(100);
    await sleep(10);
    t.equals(finished, 10, 'all 10 thread has through gate');

    t.end();
});

tape('semaphore example', async (t) => {
    const semaphore = new Semaphore(0);
    let started = 0;
    let finished = 0;
    async function thread() {
        started += 1;
        await semaphore.p(2);
        finished += 1;
    }

    thread();
    console.log('started', started);
    console.log('finished', finished);

    semaphore.v(2);
    await sleep(10);
    console.log('started', started);
    console.log('finished', finished);
    t.end();
});