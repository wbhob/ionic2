import {ElementRef, Directive, Component, View, Host, onDestroy} from 'angular2/angular2';

import {IonicConfig} from '../../config/config';
import {MaterialRippleEffect} from '../material/ripple';

@Directive({
  selector: 'button[fab],[button][fab]',
  lifecycle: [onDestroy]
})
export class MaterialFAB {
  constructor(elementRef: ElementRef, config: IonicConfig) {
    this.elementRef = elementRef;

    console.log('FAB');

    if(config.setting('mdRipple')) {
      this.ripple = new MaterialRippleEffect(this);
    }
  }

  onDestroy() {

  }
}

@Component({
  selector: 'ion-fab-actions'
})
@View({
  template: '<ng-content></ng-content>'
})
export class MaterialFABActions {
  constructor() {
    console.log('FAB ACTIONS');
  }
}

@Component({
  selector: 'ion-fab-action'
})
@View({
  template: '<button><ng-content></ng-content></button>'
})
export class MaterialFABAction {
  constructor(@Host() actions: MaterialFABActions) {
    console.log('FAB ACTION', actions);
  }
}
