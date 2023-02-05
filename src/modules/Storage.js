export class Storage {
  static get(storageName) {
    return JSON.parse(localStorage.getItem(storageName)) || [];
  }
  static save(storageName, data) {
    return localStorage.setItem(storageName, JSON.stringify(data));
  }
}
