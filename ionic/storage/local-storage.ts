import {StorageStrategy} from './storage';

export class LocalStorage extends StorageStrategy {
  constructor() {
    super();
  }
  get(key) {
    return window.localStorage.getItem(key);
  }
  set(key, value) {
    return window.localStorage.setItem(key, value);
  }
}
