import {App, IonicView, NavController} from 'ionic/ionic';

@IonicView({
  template: `<ion-navbar *navbar primary><ion-title>First Page</ion-title></ion-navbar>
  <ion-content padding><button primary (click)="push()">Push</button></ion-content>`
})
class FirstPage {
  constructor(nav: NavController) {
    this.nav = nav;
    console.log('Nav', nav);
  }
  push() {
    this.nav.push(FirstPage);
  }
}
@App({
  templateUrl: "main.html",
  routes: [
    {
      path: '/first',
      component: FirstPage,
      root: true
    }
  ]
})
class IonicSF {
  constructor() {

  }

}
/*
@App({
  templateUrl: "main.html"
})
class IonicSF {
  constructor() {

  }
}
*/

/*
@IonicView({
  template: `<ion-content padding><button primary (click)="push()">Push</button></ion-content>`
})
class SecondPage {
  constructor(nav: NavController) {
    this.nav = nav;
    console.log('Nav', nav);
  }
  push() {
    this.nav.push(SecondPage);
  }
}
@IonicView({
  template: `<ion-navbar *navbar primary><ion-title>First Page</ion-title></ion-navbar>
  <ion-content padding><button primary (click)="push()">Push</button></ion-content>`
})
class FirstPage {
  constructor(nav: NavController) {
    this.nav = nav;
    console.log('Nav', nav);
  }
  push() {
    this.nav.push(SecondPage);
  }
}

@App({
  templateUrl: 'main.html',
  routes: [
    {
      path: '/first',
      component: FirstPage,
      root: true
    }
  ]
})
class IonicSFApp {
  constructor() {
    console.log('Starting app');
  }
}
*/
