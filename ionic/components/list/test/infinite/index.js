import {bootstrap, NgFor, ProtoViewRef, ViewContainerRef} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Parent} from 'angular2/src/core/annotations_impl/visibility';

import {Content, List, Item, ItemCellTemplate} from 'ionic/ionic';


@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Content, List, Item, ItemCellTemplate, NgFor]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')

    /*
    this.itemTemplate = `
    <ion-item style="height: 44px" class="item"><div class="item-content"><div class="item-media"><img  style="max-width: 32px; border-radius: 5px" src="{{image}}?q={{r}}"></div><div class="item-label">{{title}}</div></div></ion-item>
    `;
    */

    let images = ['i1.jpg', 'i2.jpg', 'i3.jpg', 'i4.jpg'];

    this.items = []
    for(let i = 0; i < 10000; i++) {
      this.items.push({
        title: 'Item ' + i,
        image: images[Math.floor(Math.random() * images.length)],
        r: '' + Math.floor(Math.random() * 50000)
      })
    }
  }
}


export function main() {
  bootstrap(IonicApp);
}
