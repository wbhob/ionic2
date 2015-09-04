import {StorageStrategy} from './storage';

import * as util from 'ionic/util';

const DB_NAME = '__ionicstorage';

export class SQLStorage extends StorageStrategy {
  static BACKUP_LOCAL =  2
  static BACKUP_LIBRARY = 1
  static BACKUP_DOCUMENTS = 0

  constructor(options) {
    super();

    let dbOptions = util.defaults({
      name: DB_NAME,
      backupFlag: SQLStorage.BACKUP_NONE,
      existingDatabase: false
    }, options);


    if(window.sqlitePlugin) {
      let location = this._getBackupLocation(dbOptions);

      this._db = window.sqlitePlugin.openDatabase(util.extend({
        name: dbOptions.name,
        location: location,
        createFromLocation: dbOptions.existingDatabase ? 1 : 0
      }, dbOptions));
    } else {
      console.warn('Storage: SQLite plugin not installed, falling back to WebSQL. Make sure to install cordova-sqlite-storage in production!');

      this._db = window.openDatabase(dbOptions.name, '1.0', 'database', 5 * 1024 * 1024);
    }
    this._tryInit();
  }

  _getBackupLocation(dbFlag) {
    switch(dbFlag) {
      case SQLStorage.BACKUP_LOCAL:
        return 2;
      case SQLStorage.BACKUP_LIBRARY:
        return 1;
      case SQLStorage.BACKUP_DOCUMENTS:
        return 0;
      default:
        throw Error('Invalid backup flag: ' + dbFlag);
    }
  }

  // Initialize the DB with our required tables
  _tryInit() {
    this._db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS kv (id integer primary key, key text, value text)', [], (tx, res) => {
      }, (tx, err) => {
        console.error('Storage: Unable to create initial storage tables', tx, err);
      });
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      try {

        this._db.transaction(tx => {
          tx.executeSql("select key, value from kv where key = ? limit 1", [key], (tx, res) => {
            let item = null;
            if(res.rows.length > 0) {
              item = res.rows.item(0);
            }
            resolve(item);
          }, (tx, err) => {
            reject({
              tx: tx,
              err: err
            });
          })
        }, err => {
          reject(err);
        });

      } catch(e) {
        reject(e);
      }
    });
  }
  set(key, value) {
    return new Promise((resolve, reject) => {
      try {
        window.localStorage.setItem(key, value);
        resolve();
      } catch(e) {
        reject(e);
      }
    });
  }
  remove(key) {
    return new Promise((resolve, reject) => {
      try {
        window.localStorage.removeItem(key);
        resolve();
      } catch(e) {
        reject(e);
      }
    });
  }
}
