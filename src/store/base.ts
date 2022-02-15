import { makeObservable, action } from "mobx";
import { Collection } from "utils/collection";

type Snowflake = string;

type Identifiable = { id: Snowflake };
export class Store<T extends Identifiable> extends Collection<Snowflake, T> {
  constructor() {
    super();
    makeObservable(this, {
      add: action,
      remove: action,
    });
  }

  add(data: T | T[]): this {
    if (Array.isArray(data)) {
      data.forEach((d) => {
        this.add(d);
      });
      return this;
    }
    this.set(data.id, data);
    return this;
  }

  // same as add, but ignores `undefined`
  addAndPatch(data: T | T[]): this {
    if (Array.isArray(data)) {
      data.forEach((d) => {
        this.addAndPatch(d);
      });
      return this;
    }
    if (this.has(data.id)) {
      const exist = this.get(data.id);
      this.set(data.id, { ...exist, ...data });
    } else {
      this.set(data.id, data);
    }
    return this;
  }

  remove(id: Snowflake): this {
    this.delete(id);
    return this;
  }
}

export class OneToManyStore extends Collection<Snowflake, Array<Snowflake>> {
  constructor() {
    super();
    makeObservable(this, {
      add: action,
      remove: action,
      removeAll: action,
    });
  }

  add(key: Snowflake, value: Snowflake, index?: number): this {
    const exist = this.get(key);
    if (!exist) {
      this.set(key, [value]);
      return this;
    } else {
      if (exist.indexOf(value) !== -1) return this;
      if (index) {
        exist.splice(index, 0, value);
      } else {
        exist.push(value);
      }
      return this;
    }
  }

  addMany(key: Snowflake, values: Snowflake[]): this {
    const exist = this.get(key) || [];
    const newValues = exist.concat(values);
    this.set(key, newValues);
    return this;
  }

  update(key: Snowflake, values: Snowflake[]): this {
    this.set(key, values);
    return this;
  }

  remove(key: Snowflake, value: Snowflake): this {
    const values = this.get(key);
    if (values) {
      const index = values.findIndex((v) => v === value);
      if (index !== -1) {
        values.splice(index, 1);
      }
    }
    return this;
  }

  removeAll(key: Snowflake): this {
    this.delete(key);
    return this;
  }
}
