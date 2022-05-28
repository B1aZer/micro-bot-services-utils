// const DB = require('./db.js');
// const db = new DB(filename);
// db.set(1, 2)
// for [k,v] of db
const fs = require('fs');
const path = require('path');
const main = require('require-main-filename')();

// TODO: extends Map
module.exports = class DB {
    #path;
    #map;
    constructor(filename) {
        this.#path = `${path.dirname(main)}/${filename}.db`;
        this.#map = this.load();
    }
    set(k, v) {
        const r = this.#map.set(k, v);
        this.save();
        return r;
    }
    get(k) {
        const r = this.#map.get(k);
        return r;
    }
    [Symbol.iterator]() {
        const r = this.#map[Symbol.iterator]();
        return r;
    }
    clear() {
        const r = this.#map.clear();
        fs.unlinkSync(this.#path);
        return r;
    }
    get size() {
        const r = this.#map.size;
        return r;
    }
    load() {
        let r;
        try {
            const data = fs.readFileSync(this.#path);
            r = new Map(JSON.parse(data))
        } catch (err) {
            r = new Map();
        }
        return r;
    }
    save() {
        const data = JSON.stringify([...this.#map]);
        fs.writeFileSync(this.#path, data);
    }
}