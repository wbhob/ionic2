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

    this.itemTemplate = `
    <ion-item style="height: 44px" class="item">{{title}}</ion-item>
    `;

    this.items = []
    for(let i = 0; i < 1000; i++) {
      this.items.push({
        title: 'Item ' + i
      })
    }
  }
}


export function main() {
  bootstrap(IonicApp);
}
