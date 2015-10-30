import {Directive, ElementRef, Host, Optional} from 'angular2/angular2';
import {Content} from '../content/content';
import {throttle} from '../../util/util';
import {position, offset, CSS, raf} from '../../util/dom';
import {FeatureDetect} from '../../util/feature-detect';
import {Config} from '../../config/config';

/**
 * TODO
 */
@Directive({
  selector: 'ion-item-group',
  host: {
    'class': 'item-group'
  }
})
export class ItemGroup {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   */
  constructor(elementRef: ElementRef) {
    this.ele = elementRef.nativeElement;
  }
}

/**
 * TODO
 */
@Directive({
  selector: 'ion-item-group-title',
  host: {
    'class': 'item-group-title',
    '[class.sticky]': 'isSticky'
  }
})
export class ItemGroupTitle {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   */
  constructor(elementRef: ElementRef, config: Config) {
    // make sure the sticky class gets set on the title
    this.isSticky = true;
  }
}
