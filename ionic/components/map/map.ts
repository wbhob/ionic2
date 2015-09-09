import {Injectable} from 'angular2/angular2';

import {Overlay} from '../overlay/overlay';
import {Animation} from '../../animations/animation';
import * as util from 'ionic/util';


/**
 * @name ionMap
 * @description
 */
@Component({
  selector: 'ion-map',
})
@View({
  template: 'Hello'
})
export class Map {
  constructor() {
  }

  onInit() {
    /**
    if window.NativeView {
      NativeView.create(NativeView.GoogleMaps, this.elementRef.getNativeElement();)
      NativeView.create(NativeView.Camera, this.elementRef.getNativeElement();)
      NativeView.create(NativeView.Video, this.elementRef.getNativeElement();)
      NativeView.create(NativeView.OpenGL, this.elementRef.getNativeElement();)
    }
  }
  }
}
