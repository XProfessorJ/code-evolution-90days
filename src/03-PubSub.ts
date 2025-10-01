class Subscriber {
    private bus: Bus;
    constructor(bus: Bus) {
        this.bus = bus;
    }
    subscribe(event: string, fn: Function) {
        this.bus.subscribe(event, fn);
    }
}

class Publisher {
    private bus: Bus;
    constructor(bus: Bus) {
        this.bus = bus;
    }
    publish(event: string, info: string) {
        this.bus.publish(event, info, info)
    }
}

class Bus {
    private channels: Map<string, Function[]>
    constructor() {
        this.channels = new Map();
    }
    publish(event: string, ...args: any[]) {
        const channel = this.channels.get(event);
        if (!channel) this.channels.set(event, []);
        else {
            channel.forEach(
                fn => fn.apply(this, args)
            );
        }
    }
    subscribe(event: string, fn: Function) {
        const channel = this.channels.get(event);
        if (!channel) this.channels.set(event, [fn]);
        else {
            channel.push(fn);
        }
    }
}

let bus = new Bus();
let pub1 = new Publisher(bus);
let subscribe1 = new Subscriber(bus);
let pub2 = new Publisher(bus);
let subscribe2 = new Subscriber(bus);
let subscribe3 = new Subscriber(bus);
pub1.publish("hit", "hithit")
pub2.publish("touch", "touchtouch")

subscribe1.subscribe("hit", (...info) => console.log('this is subscribe1 got info: ', info));
subscribe2.subscribe('touch', (...info) => console.log('this is subscribe2 got info: ', info));

subscribe3.subscribe("hit", (...info) => console.log('this is subscribe3 got info: ', info));
subscribe3.subscribe('touch', (...info) => console.log('this is subscribe3 got info: ', info));

pub1.publish("hit", "hithit2")
pub2.publish("touch", "touchtouch2")


//now first version comes, and let's consider more features
// 1. hot/cold

class SubscriberV2 {
    private bus: BusV2;
    constructor(bus: BusV2) {
        this.bus = bus;
    }
    subscribe(event: string, fn: Function) {
        this.bus.subscribe(event, fn);
    }
}

class PublisherV2 {
    private bus: BusV2;
    constructor(bus: BusV2) {
        this.bus = bus;
    }
    publish(event: string, info: string) {
        this.bus.publish(event, info)
    }
}

class BusV2 {
    private channels: Map<string, Function[]>
    private stores: Map<string, string[]> // create a new store to store the value for Behavior/Replay
    constructor() {
        this.channels = new Map();
        this.stores = new Map();
    }
    publish(event: string, ...args: any[]) {
        const channel = this.channels.get(event);
        if (!channel) this.channels.set(event, []);
        else {
            channel.forEach(
                fn => fn.apply(this, args)
            );
        }
        const store = this.stores.get(event);// Check whethere we need already created
        if (!store) this.stores.set(event, [...args]);
        else {
            store.push(...args);
        }
    }
    subscribe(event: string, fn: Function) {
        const channel = this.channels.get(event);
        if (!channel) this.channels.set(event, [fn]);
        else {
            channel.push(fn);
        }
        const store = this.stores.get(event);// check whether need to replay
        if (store) {
            store.forEach(
                (info) => {
                    fn(info);
                }
            )
        }
    }
}

console.log("*".repeat(40));
let busv2 = new BusV2();
let pubV2 = new PublisherV2(busv2);
pubV2.publish("click", 'hi 1');
pubV2.publish("click", 'hi 2');
let subV2 = new SubscriberV2(busv2);
subV2.subscribe("click",(info)=>{console.log("received click info and say: ", info)});