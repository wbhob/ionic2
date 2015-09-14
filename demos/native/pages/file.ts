import {NgControl} from 'angular2/angular2';

import {IonicView, File} from 'ionic/ionic';


@IonicView({
  template: `
  <ion-navbar *navbar>
    <a menu-toggle>
      <icon menu></icon>
    </a>
    <ion-title>File</ion-title>
  </ion-navbar>
  <ion-content class="padding">
    <h2>File</h2>
    <input type="text" [(ng-model)]="fileName">
    <br>
    <textarea [(ng-model)]="fileContents"></textarea>
    <div>
      <button primary outline (click)="checkExists()">Exists?</button>
      <button primary outline (click)="loadFile()">Load</button>
      <button primary outline (click)="writeFile()">Save</button>
    </div>
  </ion-content>
  `
})
export class FilePage {
  constructor() {
    this.fileName = 'data.txt';
    this.fileContents = '';
  }
  checkExists() {
    /*
    File.exists(this.fileName).then((exists) => {
      console.log('Exists?', exists);
    }, (err) => {
      console.error(err);
    });
    */
  }

  loadFile() {

  }

  writeFile() {

  }

}
