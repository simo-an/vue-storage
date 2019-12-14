import uuid from 'uuid/v1';
import { toJSON, toString } from './utils';

const isDev = process.env === 'development';

class LocalStorage {
  constructor(options = {}) {
    this.DB_NAME = options.DB_NAME || options.dbName;
    this.DE_KEY = options.DE_KEY || 'id';
    this.version = options.VERSION || options.version || 'V1';
    this.storages = options.storages || options.storage || [];

    this.init();
  }

  get storageMap() {
    return this.storages.reduce((store, current) => {
      store[current.store] = current;

      return store;
    }, {});
  }

  init() {
    this.storages.forEach((storage) => {
      if (storage.type === Array && !storage.key) storage.key = this.DE_KEY;

      const value = this.get(storage.store);

      if (!value && value !== storage.default) {
        this.set(storage.store, storage.default);
      }
    });
  }

  versioned(key) { return `${this.version}_${key}`; }
  isTypeMatched(key, value) {
    const storage = this.storageMap[key];

    return !storage || value.constructor === storage.type;
  }

  // for signal target
  set(key, value) {
    if (isDev && !this.isTypeMatched(key, value)) throw new TypeError('Wrong Type!');

    window.localStorage.setItem(this.versioned(key), toString(value));

    return this;
  }

  get(key) { return toJSON(window.localStorage.getItem(this.versioned(key))); }

  remove(key) {
    window.localStorage.removeItem(this.versioned(key));

    return this;
  }

  // for array target
  insertItem(key, value) {
    const storage = this.storageMap[key];

    if (!storage) throw new ReferenceError('No storage matched!');
    if (!value[storage.key]) {
      if (!storage.autoKey) value[storage.key] = uuid();
      else throw new ReferenceError('No primary Key!');
    }

    const itemList = this.get(key);
    const index = itemList.findIndex((i) => i[storage.key] === value[storage.key]);

    if (index !== -1) throw new ReferenceError('The value exist already!');
    else itemList.push(value);

    return this.set(key, itemList);
  }

  insertOrUpdate(key, value) {
    try {
      this.insertItem(key, value);
    }
    catch (e) {
      this.updateItem(key, value);
    }

    return this;
  }


  removeItem(key, removedKeys) {
    const storage = this.storageMap[key];

    if (!storage) throw new ReferenceError('No storage matched!');
    const itemList = this.get(key);

    if (!Array.isArray(removedKeys)) removedKeys = [ removedKeys ];

    const result = itemList.filter((i) => removedKeys.some((v) => v !== i[storage.key])) || [];

    return this.set(key, result);
  }

  updateItem(key, value) {
    const storage = this.storageMap[key];

    if (!storage) throw new ReferenceError('No storage matched!');
    if (!value[storage.key]) throw new ReferenceError('Value\'s key not existed!');

    const itemList = this.get(key);
    const index = itemList.findIndex((item) => item[storage.key] === value[storage.key]);

    if (index > -1) itemList[index] = value;

    return index === -1 ? this : this.set(key, itemList);
  }

  getItem(key, value) {
    const storage = this.storageMap[key];

    if (!storage) throw new ReferenceError('No storage matched!');
    const itemList = this.get(key);

    return itemList.find((item) => item[storage.key] === value);
  }

  clear(key) {
    const storage = this.storageMap[key];

    if (!storage || storage.type !== Array) throw new ReferenceError('No storage matched!');

    return this.set(key, []);
  }
  // For Adapter
  insert(key, value) { return this.set(key, value); }
  delete(key) { return this.remove(key); }
  update(key, value) { return this.insert(key, value); }
  query(key) { return this.get(key); }

  queryItem(key, value) { return this.getItem(key, value); }
}

let _VUE;

function install(VUE) {
  if (install.installed && VUE === _VUE) return;

  install.installed = true;
  _VUE = VUE;

  function initLocalStorage() {
    const options = this.$options;

    this.$storage = options.storage || (options.parent && options.parent.$storage);
  }

  VUE.mixin({ beforeCreate: initLocalStorage });
}

LocalStorage.install = install;

export default LocalStorage;
