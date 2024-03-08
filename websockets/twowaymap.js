export default class TwoWayMap {
    constructor() {
        this.forward = {};
        this.backward = {};
    }

    set(key, value) {
        this.forward[key] = value;
        this.backward[value] = key;
    }

    getForward(key) {
        return this.forward[key];
    }

    getBackward(key) {
        return this.backward[key];
    }

    deleteForward(key) {
        const value = this.getForward(key);
        console.log(value);
        delete this.forward[key];
        delete this.backward[value];
    }

    deleteBackward(key) {
        const value = this.getBackward(key);
        console.log(value);
        delete this.forward[value];
        delete this.backward[key];
    }

    count() {
        return Object.keys(this.forward).length;
    }
}
