function debounce(fn: Function, interval: number) {
    let attr: string;
    let timer: any = null;
    return function () {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => fn(), interval);
    };
}

const log = debounce(() => console.log(1), 2000);
log();
log();
log();

const log2 = debounce(() => console.log(2), 2000);
log2();
log2();
log2();

// function throttle(fn: Function, interval: number): Function {
//     let timer: any = null;
//     return function () {
//         if (!timer) timer = setTimeout(() => {
//             fn();
//             timer = null;
//         }, interval)
//         return;
//     }
// }

// const log = throttle(() => console.log('hit'), 1000);
// log();                   // 1s 后打印 'hit'
// setTimeout(log, 1500);


// const fn = () => { console.log(1) }
// const log2 = throttle(fn, 2000);
// const log3 = throttle(() => console.log(2), 3000);
// log2();
// log2();
// log3();
// log3();
