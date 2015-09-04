import {Aside} from 'ionic/components/aside/aside';
import {Animation} from 'ionic/animations/animation';
import {CSS} from 'ionic/util/dom'

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
  constructor(aside: Aside, private movesAside, private movesContent, private movesBackdrop) {
    this.aside = aside;

    aside.contentElement.classList.add('aside-content')

  }
  setOpen(open) {
    console.log('Opening', open, open ? 0 : this.aside.width(), open ? this.aside.width() : 0);
    return new Promise((resolve, reject) => {
      
      let animation = new Animation();
      this.asideAnimation = new Animation(this.aside.getNativeElement());
      this.contentAnimation = new Animation(this.aside.contentElement);
      this.backdropAnimation = new Animation(this.aside.backdrop.getNativeElement());

      if(this.movesAside) {
        animation.add(this.asideAnimation);
      }
      if(this.movesContent) {
        animation.add(this.contentAnimation);
      }
      if(this.movesBackdrop) {
        animation.add(this.backdropAnimation);
      }

      //asideAnimation.fromTo('translateX', (open ? 0 : this.aside.width()) + 'px', (open ? this.aside.width() : 0) + 'px');
      //backdropAnimation.fromTo('opacity', open ? 0.01 : 0.5, open ? 0.5 : 0.01);
      //animation.add(asideAnimation, backdropAnimation);

      animation.duration(200);
      animation.easing('ease');

      this.animation = animation;
      this.asideAnimation.fromTo('translateX', (open ? 0 : this.aside.width()) + 'px', (open ? this.aside.width() : 0) + 'px');
      this.contentAnimation.fromTo('translateX', (open ? 0 : this.aside.width()) + 'px', (open ? this.aside.width() : 0) + 'px');
      this.backdropAnimation.fromTo('opacity', open ? 0.01 : 0.5, open ? 0.5 : 0.01);

      this.animation.play().then(() => {
        resolve();
        if(!open) {
          //this.aside.getNativeElement().style.visibility = 'hidden';
        }
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
    super(aside, true /* moves aside */, false /* moves content */, true /* moves backdrop */);
  }
}

export class AsideTypeReveal extends AsideType {
  constructor(aside: Aside) {
    super(aside, false /* moves aside */, true /* moves content */, false /* moves backdrop */);
  }
}
