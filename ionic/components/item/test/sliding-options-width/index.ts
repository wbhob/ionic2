import {Component, forwardRef, NgFor, NgIf, View} from 'angular2/angular2';
import {App, Icon, List, ListHeader, ItemSliding} from 'ionic/ionic';
import {IonicComponent, IonicView} from '../../../../config/decorators';
import {FormBuilder, Validators} from 'angular2/forms';

@App({
  directives: [forwardRef(() => MyComponentList)],
  templateUrl: 'main.html'
})
export class E2EApp {
  constructor() {
    var fb = new FormBuilder();
    this.scheduleForm = fb.group({
      scheduleShowing: ['all', Validators.required]
    });
    this.searchForm = fb.group({
      searchQuery: ['', Validators.required]
    });

    this.details = [{
      name: 'First', 
      list: [{name: 'Rancid', title: 'And out come the wolves..'}, {name: 'Nofx', title: 'So long and thanks for all the shoes'}, { name: 'The Descendents', title: 'self title'}]
    }];
  }
  onInit() {
    console.log('onInit e2eapp');
  }
}

@Component({
  properties: ['data'],
  selector: 'my-component-list'
})
@View({
  template: `
    <div *ng-if="data.length > 0">
    <ion-list class="outer-content" *ng-for="#detail of data">
      <ion-header>
        {{detail.name}}
      </ion-header>
      <ion-item-sliding *ng-for="#item of detail.list">
        <span>{{item.name}}</span>
        <div item-right>
          <icon pin></icon>
          <span>&nbsp;{{item.title}}</span>
        </div>
        <ion-item-options>
          <button primary>Add to playlist</button>
          <button danger>Delete</button>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>
    </div>
    <div *ng-if="data.length == 0">No items</div>
  `,
  directives: [Icon, ItemSliding, List, ListHeader, NgFor, NgIf]
})
export class MyComponentList {
  constructor() {
  }
  onInit() {
    console.log('onInit');
  }
}
