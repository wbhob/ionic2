import {Aside} from 'ionic/components/aside/aside';
//TODO: figure out way to get rid of all the ../../../../
import {SlideEdgeGesture} from 'ionic/gestures/slide-edge-gesture';

class AsideGenericGestureHandler extends SlideEdgeGesture {
  constructor(aside: Aside, targetElement, threshold) {
    super(targetElement, {
      direction: (aside.side === 'left' || aside.side === 'right') ? 'x' : 'y',
      edge: aside.side,
      threshold: threshold
    });
    console.log('Target', aside, targetElement);
    this.aside = aside;
    this.listen();
  }
  // Set CSS, then wait one frame for it to apply before sliding starts
  onSlideBeforeStart(slide, ev) {
    //this.aside.setSliding(true);
    this.aside.setChanging(true);
    return new Promise(resolve => {
      requestAnimationFrame(resolve);
    });
  }
  onSlide(slide, ev) {
    this.aside.setOpenAmt(slide.distance / slide.max);
    this.aside.setTransform(slide.distance);
  }
  onSlideEnd(slide, ev) {
    if (Math.abs(ev.velocityX) > 0.2 || Math.abs(slide.delta) > Math.abs(slide.max) * 0.5) {
      this.aside.setOpen(!this.aside.isOpen);
    } else {
      this.aside.setOpen(this.aside.isOpen);
    }
  }

  getElementStartPos(slide, ev) {
    return this.aside.isOpen ? slide.max : slide.min;
  }
  getSlideBoundaries() {
    return {
      min: 0,
      max: this.aside.width()
    };
  }
}

export class AsideTargetGesture extends AsideGenericGestureHandler {
  constructor(aside: Aside) {
    super(aside, aside.getNativeElement(), 0);
  }
  canStart(ev) {
    return this.aside.isOpen;
  }
}
export class AsideContentGesture extends AsideGenericGestureHandler {
  constructor(aside: Aside) {
    super(aside, aside.getContentElement(), 75);
  }
  canStart(ev) {
    return this.aside.isOpen ? true : super.canStart(ev);
  }
}

export class LeftAsideGesture extends AsideContentGesture {
  constructor(aside: Aside) {
    super(aside);
  }
}

export class RightAsideGesture extends LeftAsideGesture {
  constructor(aside: Aside) {
    super(aside);
  }
  getElementStartPos(slide, ev) {
    return this.aside.isOpen ? slide.min : slide.max;
  }
  getSlideBoundaries() {
    return {
      min: -this.aside.width(),
      max: 0
    };
  }

}

/*
 Not supported right now
export class TopAsideGesture extends AsideGesture {
  onSlide(slide, ev) {
    this.aside.setTransform(slide.distance);
  }
  getSlideBoundaries() {
    return {
      min: 0,
      max: this.aside.height()
    };
  }
}

export class BottomAsideGesture extends TopAsideGesture {
  getElementStartPos(slide, ev) {
    return this.aside.isOpen ? slide.min : slide.max;
  }
  getSlideBoundaries() {
    return {
      min: -this.aside.height(),
      max: 0
    };
  }
}
*/
