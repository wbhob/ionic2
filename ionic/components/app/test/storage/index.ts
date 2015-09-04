import {Component} from 'angular2/angular2';
import {Control, ControlGroup} from 'angular2/forms';

import {App, Http, Storage, LocalStorage} from 'ionic/ionic';

console.log('Storage', Storage);

let testUrl = 'https://ionic-api-tester.herokuapp.com/json';
let testUrl404 = 'https://ionic-api-tester.herokuapp.com/404';


@App({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    this.storage = new Storage(LocalStorage);
  }
  get() {
    let value = this.storage.get('name');
    alert('Your name is: ' + value);
  }
  set() {
    let name = prompt('Your name?');

    this.storage.set('name', name);
  }
}
