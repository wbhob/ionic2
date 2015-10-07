import {App, IonicApp, IonicView, NavController, NavParams} from 'ionic/ionic';
import {IonicView, Events} from 'ionic/ionic';
import {MainPage} from 'index';
import * as helpers from 'helpers';

@IonicView({
  templateUrl: 'menu-home.html'
})
class PageOne{
  constructor(nav: NavController, events: Events) {
      this.nav = nav;
      this.events = events;

      window.onmessage = (e) => {
      zone.run(() => {
        if (e.data) {
          var data = JSON.parse(e.data);
          var componentTitle = helpers.toTitleCase(data.hash.replace('-', ' '));
          console.log('Switching section to', componentTitle);
          this.nav.setRoot(MainPage, {location: componentTitle});
          events.publish('page:locationChange', { componentName: componentTitle });
        }
      });
      };

  }
}

@IonicView({
  templateUrl: 'menu-friends.html'
})
class PageTwo{
}

@IonicView({
  templateUrl: 'menu-events.html'
})
class PageThree{
}

@IonicView({
  templateUrl: 'menu.html'
})
export class MenuPage {

  constructor(app: IonicApp, events: Events, nav: NavController) {
    this.nav = nav;
    this.app = app;
    this.rootView = PageOne;
    this.pages = [
      { title: 'Home', component: PageOne },
      { title: 'Friends', component: PageTwo },
      { title: 'Events', component: PageThree }
    ];

  }

  onViewWillUnload() {
  }

  openPage(menu, page) {
    // close the menu when clicking a link from the menu
    menu.close();

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    // let nav = this.app.getComponent('nav');
    this.nav.setRoot(page.component);
  }
}


