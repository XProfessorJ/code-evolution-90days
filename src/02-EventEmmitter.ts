
console.log("*".repeat(40), "version 1");
class EventEmitter {
    private eventRegister: Map<string, Function>
    constructor() {
        this.eventRegister = new Map();
    }
    on(event: string, fn: Function) {
        this.eventRegister.set(event, fn);
    }
    emit(event: string, info: string) {
        this.eventRegister.get(event)!(info);
    }
}

let bus = new EventEmitter();
bus.on("click", (val) => console.log("you clicked!✅ and say", val))
bus.emit("click", "Yaaa");

bus.on("touch", (val) => console.log("you touch!✅ and say", val))
bus.emit("touch", "Humm");
bus.emit("click", "Yaaa");
bus.emit("touch", "Humm")

//version 1 completed, but it has the problems:
// current eventRegister can only store for one listener
// bus.on("click", () => console.log("click1"));
// bus.on("click", () => console.log("click2"));
// bus.emit("click", "hi");
// it will only return click2, because when we set #2 click event, it will overlap #1 click

// Okay! Let fix it!

console.log("*".repeat(40), "version 2");
class EventEmitterV2 {
    private eventRegister: Map<string, Function[]>
    constructor() {
        this.eventRegister = new Map();
    }
    on(event: string, fn: Function) {
        const fnList = this.eventRegister.get(event);
        if (fnList) fnList.push(fn);
        else this.eventRegister.set(event, [fn]);
    }
    emit(event: string, info: string) {
        this.eventRegister.get(event)?.forEach(fn => fn(info))
    }
}

let busV2 = new EventEmitterV2();
busV2.on("click", (val) => console.log("you clicked!✅ and say", val))
busV2.emit("click", "Yaaa");

busV2.on("click", (val) => console.log("you strong click!🚔 and say", val))
busV2.emit("click", "Yaaa");

//Now it works.
//We think about next version of Unsubscribe it
console.log("*".repeat(40), "version 3");
class EventEmitterV3 {
    private eventRegister: Map<string, Function[]>
    constructor() {
        this.eventRegister = new Map();
    }
    on(event: string, fn: Function) {
        const fnList = this.eventRegister.get(event);
        if (fnList) fnList.push(fn);
        else this.eventRegister.set(event, [fn]);
    }
    emit(event: string, info: string) {
        this.eventRegister.get(event)?.forEach(fn => fn(info))
    }

    off(event: string, fn: Function) {
        if (!this.eventRegister.get(event)) return;
        const fnList = this.eventRegister.get(event)?.filter(f => f !== fn);
        this.eventRegister.set(event, fnList!);
    }
}

let busV3 = new EventEmitterV3();
let fn = (val) => console.log("you clicked!✅ and say", val);
busV3.on("click", fn)
busV3.emit("click", "Yaaa");

// let f2 = (val) => console.log("you strong click!🚔 and say", val)

// busV3.on("click", f2)
// busV3.emit("click", "Yaaa");

busV3.off("click", fn)
busV3.emit("click", "Laa");

//Now, we did it!


//Okay, at last, try to do fo once feature
console.log("*".repeat(40), "version 4");

class EventEmitterV4 {
    private eventRegister: Map<string, Function[]>
    constructor() {
        this.eventRegister = new Map();
    }
    on(event: string, fn: Function) {
        const fnList = this.eventRegister.get(event);
        if (fnList) fnList.push(fn);
        else this.eventRegister.set(event, [fn]);
    }
    emit(event: string, info: string) {
        this.eventRegister.get(event)?.forEach(fn => fn(info))
    }

    off(event: string, fn: Function) {
        if (!this.eventRegister.get(event)) return;
        const fnList = this.eventRegister.get(event)?.filter(f => f !== fn);
        this.eventRegister.set(event, fnList!);
    }

    once(event: string, fn: Function) {
        //正常来说，这里有两种思路
        // 1. 最普通的就是set一个flag，给每个fn都在on的时候塞入，这样就能在emit的时候去判断收否需要删除，但是这样改很麻烦，得改原始数据结构
        // 2. 使用wrapper，包装起，已知fn只执行一次，那就在执行前把他删了
        const wrapper = (args) => {
            this.off(event, wrapper);
            fn(args);
        }
        this.on(event, wrapper);
    }
}

let fnV4 = (val) => console.log("only once trigger", val);
const eventEmitterV4 = new EventEmitterV4();
eventEmitterV4.once("click", fnV4);
eventEmitterV4.emit("click", "onClick");
eventEmitterV4.emit("click", "onClick");
eventEmitterV4.emit("click", "onClick");
