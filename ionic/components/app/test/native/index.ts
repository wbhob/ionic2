import {Component} from 'angular2/angular2';
import {Control, ControlGroup} from 'angular2/forms';

import {App, Http, Camera} from 'ionic/ionic';

let testUrl = 'https://ionic-api-tester.herokuapp.com/json';
let testUrl404 = 'https://ionic-api-tester.herokuapp.com/404';


@App({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
  }
  getPicture() {
    Camera.getPicture({

    }).then(data => {
      console.log('Data', data);
    }, err => {
      alert('Unable to take picture')
    })
  }
}
