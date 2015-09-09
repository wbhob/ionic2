import {App, IonicApp} from 'ionic/ionic';

@App({
  template: `
  <ion-toolbar><ion-title>Maps</ion-title></ion-toolbar>
  <ion-content>
    <ion-map></ion-map>
  </ion-content>
`
})
class MyApp {
  constructor(app: IonicApp) {
    this.app = app;
  }
}
