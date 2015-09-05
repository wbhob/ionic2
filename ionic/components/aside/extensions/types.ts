import {Aside} from 'ionic/components/aside/aside';
import {Animation} from 'ionic/animations/animation';
import {CSS} from 'ionic/util/dom'

class AsideOverlayInAnimation extends Animation {
 constructor(element) {
   super(element);
   this.easing('ease').duration(200);
 }
 set aside(aside) {
   this._aside = aside;

   this.backdropAnim = new Animation(aside.backdrop.getNativeElement());
   this.asideAnim = new Animation(aside.getNativeElement());

   this.backdropAnim.fromTo('opacity', 0.01, 0.5);
   this.asideAnim.fromTo('translateX', '0px', aside.width() + 'px');

   this.add(this.backdropAnim, this.asideAnim);
 }
}
Animation.register('aside-overlay-in', AsideOverlayInAnimation);

class AsideOverlayOutAnimation extends Animation {
 constructor(element) {
   super(element);
   this.easing('ease').duration(200);
 }
 set aside(aside) {
   this._aside = aside;

   this.backdropAnim = new Animation(aside.backdrop.getNativeElement());
   this.asideAnim = new Animation(aside.getNativeElement());

   this.backdropAnim.fromTo('opacity', 0.5, 0.01);
   this.asideAnim.fromTo('translateX', aside.width() + 'px',  '0px');

   this.add(this.backdropAnim, this.asideAnim);
 }
}
Animation.register('aside-overlay-out', AsideOverlayOutAnimation);

class AsideRevealInAnimation extends Animation {
 constructor(element) {
   super(element);
   this.easing('ease').duration(200);
 }
 set aside(aside) {
   this._aside = aside;

   this.contentAnim = new Animation(aside.contentElement);

   this.contentAnim.fromTo('translateX', '0px', aside.width() + 'px');

   this.add(this.contentAnim);
 }
}
Animation.register('aside-reveal-in', AsideRevealInAnimation);

class AsideRevealOutAnimation extends Animation {
 constructor(element) {
   super(element);
   this.easing('ease').duration(200);
 }
 set aside(aside) {
   this._aside = aside;

   this.contentAnim = new Animation(aside.contentElement);

   this.contentAnim.fromTo('translateX', aside.width() + 'px', '0px');

   this.add(this.contentAnim);
 }
}
Animation.register('aside-reveal-out', AsideRevealOutAnimation);

class AsidePushInAnimation extends Animation {
 constructor(element) {
   super(element);
   this.easing('ease').duration(200);
 }
 set aside(aside) {
   this._aside = aside;

   this.contentAnim = new Animation(aside.contentElement);
   this.asideAnim = new Animation(aside.getNativeElement());

   this.asideAnim.fromTo('translateX', -aside.width() + 'px', '0px');
   this.contentAnim.fromTo('translateX', '0px', aside.width() + 'px');

   this.add(this.asideAnim, this.contentAnim);
 }
}
Animation.register('aside-push-in', AsidePushInAnimation);

class AsidePushOutAnimation extends Animation {
 constructor(element) {
   super(element);
   this.easing('ease').duration(200);
 }
 set aside(aside) {
   this._aside = aside;

   this.contentAnim = new Animation(aside.contentElement);
   this.asideAnim = new Animation(aside.getNativeElement());

   this.asideAnim.fromTo('translateX', '0px', -aside.width() + 'px');
   this.contentAnim.fromTo('translateX', aside.width() + 'px', '0px');

   this.add(this.asideAnim, this.contentAnim);
 }
}
Animation.register('aside-push-out', AsidePushOutAnimation);

// TODO use setters instead of direct dom manipulation
const asideManipulator = {
  setOpen(open) {
    this.aside.getNativeElement().classList[open ? 'add' : 'remove']('open');
  },
  setTransform(t) {
    if(t === null) {
      this.aside.getNativeElement().style[CSS.transform] = '';
    } else {
      this.aside.getNativeElement().style[CSS.transform] = 'translate3d(' + t + 'px,0,0)';
    }
  }
}
const contentManipulator = {
  setOpen(open) {
    this.aside.contentElement.classList[open ? 'add' : 'remove'](
      `aside-open-${this.aside.side}`
    )
  },
  setTransform(t) {
    if(t === null) {
      this.aside.contentElement.style[CSS.transform] = '';
    } else {
      this.aside.contentElement.style[CSS.transform] = 'translate3d(' + t + 'px,0,0)';
    }
  }
}

const backdropManipulator = {
  setOpen(open) {
    let amt = open ? 0.5 : 0.01;
    this.aside.backdrop.opacity = amt;
  },
  setTransform(t) {
    if(t === null) {
      t = this.aside.width();
    }
    let fade = Math.max(0.01, 0.5 * t / this.aside.width());
    this.aside.backdrop.opacity = fade;
  }
}

export class AsideType {
  constructor(aside: Aside, private inAnimation, private outAnimation) {
    this.aside = aside;

    aside.contentElement.classList.add('aside-content')
  }
  setOpen(open) {
    this.animationIn = Animation.create(this.aside.getNativeElement(), this.inAnimation);
    this.animationIn.aside = this.aside;
    this.animationOut = Animation.create(this.aside.getNativeElement(), this.outAnimation);
    this.animationOut.aside = this.aside;


    return new Promise((resolve, reject) => {
      console.log('Playing', open);

      let anim;
      if(open) {
        anim = this.animationIn;
        anim.onReady(() => {
          this.aside.getNativeElement().style.visibility = 'visible';
        });
      } else {
        anim = this.animationOut;
        anim.onFinish(() => {
          this.aside.getNativeElement().style.visibility = 'hidden';
        });
      }

      anim.play().then(() => {
        resolve(open);
      }, () => {
        reject();
      });
    });
  }
  setTransform(t) {
  }
  setDoneTransforming(willOpen) {
  }
}

export class AsideTypeOverlay extends AsideType {
  constructor(aside: Aside) {
    super(aside, 'aside-overlay-in', 'aside-overlay-out');
  }
  setTransform(t) {
    console.log('Transform', t);
  }
  setDoneTransforming(willOpen) {

  }
}

export class AsideTypeReveal extends AsideType {
  constructor(aside: Aside) {
    super(aside, 'aside-reveal-in', 'aside-reveal-out');
  }
}
export class AsideTypePush extends AsideType {
  constructor(aside: Aside) {
    super(aside, 'aside-push-in', 'aside-push-out');
  }
}
