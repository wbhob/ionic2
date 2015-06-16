import {Renderer, Compiler, ElementRef, ProtoViewRef, ViewContainerRef} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Parent} from 'angular2/src/core/annotations_impl/visibility';

import {IonicComponent} from 'ionic/config/component'
import {ListVirtualScroll} from './virtual'

import * as util from 'ionic/util';


@Component({
  selector: 'ion-list',
  properties: [
    'items',
    'virtual',
    'content'
  ]
})
@View({
  template: `<content></content>`
})
export class List {
  constructor(
    elementRef: ElementRef,
    viewContainer: ViewContainerRef,
    compiler: Compiler
  ) {
    this.viewContainer = viewContainer;
    this.compiler = compiler;
    this.domElement = elementRef.domElement;
    this.config = List.config.invoke(this);

    setTimeout(() => {
      console.log('Content', this.content);
      console.log('Virtual?', this.virtual);
      console.log('Items?', this.items.length, 'of \'em');
      console.log('Item template', this.itemTemplate);
      //this.compiledItemTemplate = Handlebars.compile(this.itemTemplate);


      if(util.isDefined(this.virtual)) {
        this._initVirtualScrolling();
      }
    })
  }

  _initVirtualScrolling() {
    if(!this.content) {
      return;
    }

    this._virtualScrollingManager = new ListVirtualScroll(this);
    /*
    this.compiler.compileInHost(VirtualWrapper).then(componentProtoViewRef => {
      let wrapperViewRef = this.viewContainer.create(componentProtoViewRef);
      this.virtualScrollAnchorViewRef = wrapperViewRef;

      setTimeout(() => {
      })
    });
    */
  }

  setVirtualWrapper(wrapper) {
    this.virtualWrapper = wrapper;
  }

  setVirtualItemTemplate(item) {
    this.itemTemplate = item;
  }
}
new IonicComponent(List, {
  propClasses: ['inset']
})

@Directive({
  selector: 'template[cell]'
})
export class ItemCellTemplate {
  constructor(@Parent() list: List, viewContainer: ViewContainerRef, protoViewRef: ProtoViewRef) {
    console.log('Item cell template', list, viewContainer, protoViewRef);

    this.protoViewRef = protoViewRef;
    this.viewContainer = viewContainer;

    list.setVirtualItemTemplate(this);
  }
}

/*
@Component({ selector: 'ion-virtual-wrapper' })
@View({
  template: '<ion-virtual-anchor></ion-virtual-anchor><content></content>',
  directives: [VirtualAnchor]
})
export class VirtualWrapper {
  constructor(@Parent() list: List, elementRef: ElementRef, viewContainer: ViewContainerRef) {
    this.domElement = elementRef.domElement;
    this.list = list;
    this.viewContainer = viewContainer;

    this.list.setVirtualWrapper(this);
    console.log('View Container', this.viewContainer);
  }
  setAnchor(anchor) {
    this.anchor = anchor;
  }
}

@Component({ selector: 'ion-virtual-anchor' })
@View({
  template: '<content></content>'
})
export class VirtualAnchor {
  constructor(@Parent() wrapper: VirtualWrapper, viewContainer: ViewContainerRef) {
    this.wrapper = wrapper;
    this.viewContainer = viewContainer;

    this.wrapper.setAnchor(this);
  }
}
*/
