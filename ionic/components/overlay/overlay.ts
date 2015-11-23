import {Injectable, Injector, provide, Component, ElementRef, Compiler, DynamicComponentLoader, AppViewManager, NgZone, Renderer} from 'angular2/angular2';

import {AppViewManagerUtils, AppViewListener, AppViewPool, ViewContainerRef} from 'angular2/angular2';

import {getCurrentProviders} from '../../config/bootstrap';
import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {NavController} from '../nav/nav-controller';
import {Animation} from '../../animations/animation';
import {extend} from '../../util/util';


@Injectable()
export class OverlayController {

  constructor(app: IonicApp, injector: Injector) {
    this.app = app;
  }

  _load(done) {
    if (this.nav) {
      return done();
    }

    let providers = getCurrentProviders(this.app.rootRef.injector);

    let loader = this.app.rootRef.injector.get(DynamicComponentLoader);
    loader.loadNextToLocation(OverlayNav, this.app.rootRef.location, providers).then(overlayRef => {
      this.nav = overlayRef.instance;
      done();
    });
  }

  open(componentType, params = {}, opts = {}) {
    let resolve, reject;
    let promise = new Promise((res, rej) => { resolve = res; reject = rej; });

    this._load(() => {
      opts.animation = opts.enterAnimation;
      opts.animateFirst = true;

      this.nav.push(componentType, params, opts).then(viewCtrl => {
        if (viewCtrl && viewCtrl.instance) {

          let self = this;
          function escape(ev) {
            if (ev.keyCode == 27 && self.nav.last() === viewCtrl) {
              viewCtrl.instance.close();
            }
          }

          viewCtrl.instance.close = (closeOpts={}) => {
            extend(opts, closeOpts);
            opts.animation = opts.leaveAnimation;
            this.nav.pop(opts);
            document.removeEventListener('keyup', escape, true);
          };

          document.addEventListener('keyup', escape, true);
        }
        resolve();
      });
    });

    return promise;
  }

  getByType(overlayType) {
    let overlay = this.nav.getByType(overlayType);
    return overlay && overlay.instance;
  }

  getByHandle(handle, overlayType) {
    let overlay = this.nav.getByHandle(handle);
    return overlay && overlay.instance;
  }

}


@Component({
  selector: 'ion-overlay',
  template: '<template #contents></template>'
})
export class OverlayNav extends NavController {

  constructor(
    app: IonicApp,
    config: Config,
    elementRef: ElementRef,
    compiler: Compiler,
    loader: DynamicComponentLoader,
    viewManager: AppViewManager,
    zone: NgZone,
    renderer: Renderer
  ) {
    super(null, app, config, elementRef, compiler, loader, viewManager, zone, renderer);
  }

}
