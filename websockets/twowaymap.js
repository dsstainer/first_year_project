export default class TwoWayMap {
    constructor() {

        this.forward = new Map();
        this.backward = new Map();
    }

    set(key, value) {
        this.forward.set(key, value);
        this.backward.set(value ,key);
    }

    getForward(key) {
        return this.forward.get(key);
    }

    getBackward(key) {
        return this.backward.get(key);
    }

    deleteForward(key) {
        const value = this.getForward(key);
        this.forward.delete(key);
        this.backward.delete(value);
    }

    deleteBackward(key) {
        const value = this.getBackward(key);
        //console.log(this.backward.has(key));
        //console.log(this.forward.keys());
        //console.log(this.backward.values());
        this.forward.delete(value);
        this.backward.delete(key);
    }

    count() {
        const forwardCount = this.forward.size;
        const backwardCount = this.backward.size;
        console.log(forwardCount, backwardCount);
        if (forwardCount == backwardCount) {
            return forwardCount;
        }
        return -1;
    }
}
