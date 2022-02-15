import { makeObservable, action, computed, observable, toJS } from "mobx";

type VoidCallback<V, K> = (val: V, key: K, map: Map<K, V>) => void;
type BoolCallback<V, K> = (val: V, key: K, map: Map<K, V>) => boolean;
type ValueCallback<V, K, Y> = (val: V, key: K, map: Map<K, V>) => Y;
type ReduceCallback<V, K> = (
  previousValue: V,
  currentValue: V,
  currentIndex: K,
  map: Map<K, V>
) => V;
type TypedReduceCallback<V, K, U> = (
  previousValue: V,
  currentValue: V,
  currentIndex: K,
  map: Map<K, V>
) => U;

export class Collection<K, V> implements Map<K, V> {
  constructor() {
    makeObservable(this, {
      data: observable,
      set: action,
      delete: action,
      clear: action,
      size: computed,
    });
  }

  // for mobx
  data: Map<K, V> = new Map();

  get raw() {
    return toJS(this.data);
  }

  forEach(callbackfn: VoidCallback<V, K>, thisArg?: any): void {
    return this.data.forEach(callbackfn, thisArg);
  }

  clear(): void {
    this.data.clear();
  }

  delete(key: K): boolean {
    return this.data.delete(key);
  }

  get(key: K): V | undefined {
    return this.data.get(key);
  }

  has(key: K): boolean {
    return this.data.has(key);
  }

  set(key: K, value: V): this {
    this.data.set(key, value);
    return this;
  }

  get size(): number {
    return this.data.size;
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  entries(): IterableIterator<[K, V]> {
    return this.data.entries();
  }

  keys(): IterableIterator<K> {
    return this.data.keys();
  }

  values(): IterableIterator<V> {
    return this.data.values();
  }

  [Symbol.toStringTag]: string;

  find(fn: BoolCallback<V, K>, thisArg?: this) {
    if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);

    for (const [key, val] of this) {
      if (fn(val, key, this)) return val;
    }
    return undefined;
  }

  findKey(fn: BoolCallback<V, K>, thisArg?: this) {
    if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);

    for (const [key, val] of this) {
      if (fn(val, key, this)) return key;
    }
    return undefined;
  }

  sweep(fn: BoolCallback<V, K>, thisArg?: this) {
    if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
    const previousSize = this.size;
    for (const [key, val] of this) {
      if (fn(val, key, this)) this.delete(key);
    }
    return previousSize - this.size;
  }

  filter(fn: BoolCallback<V, K>, thisArg?: this): Collection<K, V> {
    if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
    const results = new this.constructor[Symbol.species]();
    for (const [key, val] of this) {
      if (fn(val, key, this)) results.set(key, val);
    }
    return results;
  }

  partition(fn: BoolCallback<V, K>, thisArg?: this): [this, this] {
    if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
    const results: [this, this] = [
      new this.constructor[Symbol.species](),
      new this.constructor[Symbol.species](),
    ];

    for (const [key, val] of this) {
      if (fn(val, key, this)) {
        results[0].set(key, val);
      } else {
        results[1].set(key, val);
      }
    }
    return results;
  }

  map<T = unknown>(fn: ValueCallback<V, K, T>, thisArg?: this): T[] {
    if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
    const arr = new Array(this.size);
    let i = 0;

    for (const [key, val] of this) arr[i++] = fn(val, key, this);
    return arr;
  }

  some(fn: BoolCallback<V, K>, thisArg?: this) {
    if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);

    for (const [key, val] of this) {
      if (fn(val, key, this)) return true;
    }
    return false;
  }

  every(fn: BoolCallback<V, K>, thisArg?: this) {
    if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);

    for (const [key, val] of this) {
      if (!fn(val, key, this)) return false;
    }
    return true;
  }

  reduce(fn: ReduceCallback<V, K>, initialValue?: undefined): V;
  reduce(fn: ReduceCallback<V, K>, initialValue: V): V;
  reduce<U>(fn: TypedReduceCallback<V, K, U>, initialValue: U): U;
  reduce(fn, initialValue) {
    let accumulator;
    if (typeof initialValue !== "undefined") {
      accumulator = initialValue;
      for (const [key, val] of this)
        accumulator = fn(accumulator, val, key, this);
    } else {
      let first = true;
      for (const [key, val] of this) {
        if (first) {
          accumulator = val;
          first = false;
          continue;
        }
        accumulator = fn(accumulator, val, key, this);
      }
    }
    return accumulator;
  }

  each(fn: VoidCallback<V, K>, thisArg?: this) {
    this.forEach(fn, thisArg);
    return this;
  }

  tap(fn: (map: this) => void, thisArg?: this) {
    if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
    fn(this);
    return this;
  }

  clone(): this {
    return new this.constructor[Symbol.species](this);
  }

  merge(...collections: this[]) {
    // eslint-disable-next-line
    for (const coll of collections) {
      // eslint-disable-next-line
      for (const [key, val] of coll) this.set(key, val);
    }
    return this;
  }

  concat(...collections: this[]) {
    const newColl = this.clone();
    // eslint-disable-next-line
    for (const coll of collections) {
      // eslint-disable-next-line
      for (const [key, val] of coll) newColl.set(key, val);
    }
    return newColl;
  }

  equals<X = unknown, Y = unknown>(collection: Collection<X, Y>) {
    if (!collection) return false;
    // @ts-ignore
    if (this === collection) return true;
    if (this.size !== collection.size) return false;
    return !this.find((value, key) => {
      const testVal = collection.get(key as any as X);
      return (
        // @ts-ignore
        testVal !== value || (testVal === undefined && !collection.has(key))
      );
    });
  }

  sort(compareFunction = (x: V, y: V) => +(x > y) || +(x === y) - 1): this {
    return new this.constructor[Symbol.species](
      [...this.entries()].sort((a, b) => compareFunction(a[1], b[1]))
    );
  }

  toList() {
    return this.map((v) => v);
  }

  static get [Symbol.species]() {
    return Collection;
  }
}
