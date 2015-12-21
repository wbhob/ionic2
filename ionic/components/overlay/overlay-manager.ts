import {Animation} from '../../animations/animation';
import {extend} from '../../util';


/**
 * @private
 */
export class OverlayManager {

  /**
   * Returns a promise, which is resolved when the overlay has closed.
   */
  open(componentType, params = {}, opts = {}) {
    if (!this.nav) {
      console.error('<ion-overlay></ion-overlay> required in root template (app.html) to use: ' + opts.pageType);
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      let viewCtrl = this.create(componentType, params, opts, resolve);

      if (viewCtrl) {
        if (viewCtrl.instance) {
          viewCtrl.instance.close = viewCtrl.close;
        }

      } else {
        reject('invalid overlay component');
      }
    });
  }

  /**
   * Returns an instance of the newly created overlay ViewController.
   */
  create(componentType, params = {}, opts = {}, done) {
    let self = this;
    opts.animation = opts.enterAnimation;

    // normally nav controllers don't animate the first view entering
    // overlays however should
    opts.animateFirst = true;

    let viewCtrl = self.nav.pushComponent(componentType, params, opts, done);

    if (viewCtrl) {

      viewCtrl.willLeave

      viewCtrl.close = function() {
        extend(opts, closeOpts);
        opts.animation = opts.leaveAnimation;
        self.nav.remove(opts);
        document.removeEventListener('keyup', escape, true);

        done && done();
      };

      function escape(ev) {
        if (ev.keyCode == 27 && self.nav.last() === viewCtrl) {
          viewCtrl.close();
        }
      }
      document.addEventListener('keyup', escape, true);
    }

    return viewCtrl;
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
