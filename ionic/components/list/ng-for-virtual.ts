import {DoCheck} from 'angular2/lifecycle_hooks';
import {Directive} from 'angular2/src/core/metadata';
import {
  ChangeDetectorRef,
  IterableDiffer,
  IterableDiffers
} from 'angular2/src/core/change_detection';
import {ViewContainerRef, TemplateRef, ViewRef} from 'angular2/src/core/linker';
import {isPresent, isBlank} from 'angular2/src/core/facade/lang';

import {Optional, Host} from 'angular2/angular2';

import {Content} from '../content/content';
import {CSS} from '../../util/dom';

/**
 * The `NgFor` directive instantiates a template once per item from an iterable. The context for
 * each instantiated template inherits from the outer context with the given loop variable set
 * to the current item from the iterable.
 *
 * # Local Variables
 *
 * `NgFor` provides several exported values that can be aliased to local variables:
 *
 * * `index` will be set to the current loop iteration for each template context.
 * * `last` will be set to a boolean value indicating whether the item is the last one in the
 *   iteration.
 * * `even` will be set to a boolean value indicating whether this item has an even index.
 * * `odd` will be set to a boolean value indicating whether this item has an odd index.
 *
 * # Change Propagation
 *
 * When the contents of the iterator changes, `NgFor` makes the corresponding changes to the DOM:
 *
 * * When an item is added, a new instance of the template is added to the DOM.
 * * When an item is removed, its template instance is removed from the DOM.
 * * When items are reordered, their respective templates are reordered in the DOM.
 * * Otherwise, the DOM element for that item will remain the same.
 *
 * Angular uses object identity to track insertions and deletions within the iterator and reproduce
 * those changes in the DOM. This has important implications for animations and any stateful
 * controls
 * (such as `<input>` elements which accept user input) that are present. Inserted rows can be
 * animated in, deleted rows can be animated out, and unchanged rows retain any unsaved state such
 * as user input.
 *
 * It is possible for the identities of elements in the iterator to change while the data does not.
 * This can happen, for example, if the iterator produced from an RPC to the server, and that
 * RPC is re-run. Even if the data hasn't changed, the second response will produce objects with
 * different identities, and Angular will tear down the entire DOM and rebuild it (as if all old
 * elements were deleted and all new elements inserted). This is an expensive operation and should
 * be avoided if possible.
 *
 * # Syntax
 *
 * - `<li *ng-for="#item of items; #i = index">...</li>`
 * - `<li template="ng-for #item of items; #i = index">...</li>`
 * - `<template ng-for #item [ng-for-of]="items" #i="index"><li>...</li></template>`
 *
 * ### Example
 *
 * See a [live demo](http://plnkr.co/edit/KVuXxDp0qinGDyo307QW?p=preview) for a more detailed
 * example.
 */
@Directive({selector: '[ng-for-virtual][ng-for-virtual-of]', inputs: ['ngForVirtualOf', 'ngForVirtualTemplate']})
export class NgForVirtual implements DoCheck {
  /** @internal */
  _ngForOf: any;
  private _differ: IterableDiffer;

  constructor(@Optional() @Host() private content: Content, private _viewContainer: ViewContainerRef, private _templateRef: TemplateRef,
              private _iterableDiffers: IterableDiffers, private _cdr: ChangeDetectorRef) {}

  onInit() {
    if(this.content) {
      console.log('NgForVirtual Scrolling', this._ngForOf);

      this.viewportHeight = this.content.height();

      this.viewContainer = this._viewContainer;

      this.itemHeight = 45;

      this.shownItems = {};
      this.enteringItems = [];
      this.leavingItems = [];

      // Compute the initial sizes
      setTimeout(() => {
        this.resize();

        // Simulate the first event to start layout
        this._handleVirtualScroll({
          target: this.content.scrollElement
        });
      })

      this.content.addScrollEventListener((event) => {
        this._handleVirtualScroll(event);
      });
    }
  }

  resize() {
    this.viewportHeight = this.content.height();
    this.viewportScrollHeight = this.content.scrollElement.scrollHeight;

    this.virtualHeight = this._ngForOf.length * this.itemHeight;
    this.itemsPerScreen = this.viewportHeight / this.itemHeight;

    console.log('VIRTUAL: resize(viewportHeight:', this.viewportHeight,
      'viewportScrollHeight:', this.viewportScrollHeight, 'virtualHeight:', this.virtualHeight,
      ', itemsPerScreen:', this.itemsPerScreen, ')');
  }

  _handleVirtualScroll(event) {
    let item;
    let shownItemRef;

    let st = event.target.scrollTop;
    let sh = event.target.scrollHeight;

    let topIndex = Math.floor(st / this.itemHeight);
    let bottomIndex = Math.floor((st / this.itemHeight) + this.itemsPerScreen);

    let items = this._ngForOf

    // Key iterate the shown items map
    // and compare the index to our index range,
    // pushing the items to remove to our leaving
    // list if they're ouside this range.
    for(let i in this.shownItems) {
      if(i < topIndex || i > bottomIndex) {
        this.leavingItems.push(this.shownItems[i]);
        delete this.shownItems[i];
      }
    }

    let realIndex = 0;
    // Iterate the set of items that will be rendered, using the
    // index from the actual items list as the map for the
    // virtual items we draw
    for(let i = topIndex, realIndex = 0; i < bottomIndex && i < items.length; i++, realIndex++) {
      item = items[i];
      console.log('Drawing item', i, item.title);

      shownItemRef = this.shownItems[i];

      // Is this a new item?
      if(!shownItemRef) {
        let itemView = this.viewContainer.createEmbeddedView(this._templateRef, realIndex);
        console.log('ITEM VIEW', itemView, itemView.render);
        itemView.render.boundElements[0].style[CSS.transform] = 'translateY(' + this.itemHeight * i + 'px)';


        shownItemRef = new VirtualItemRef(item, i, realIndex, itemView);

        itemView.setLocal('\$implicit', shownItemRef.item);
        itemView.setLocal('item', item);

        this.shownItems[i] = shownItemRef;
        this.enteringItems.push(shownItemRef);
      }


      //tuple.view = viewContainer.create(protoViewRef, tuple.record.currentIndex);

    }

    while(this.leavingItems.length) {
      let itemRef = this.leavingItems.pop();
      console.log('Removing item', itemRef.item, itemRef.realIndex);
      this.viewContainer.remove(itemRef.realIndex);
    }

    console.log('VIRTUAL SCROLL: scroll(scrollTop:', st, 'topIndex:', topIndex, 'bottomIndex:', bottomIndex, ')');
    console.log('Container has', this.content.getNativeElement().children[0].children[0].children.length, 'children');
  }

  set ngForVirtualOf(value: any) {
    this._ngForOf = value;
    if (isBlank(this._differ) && isPresent(value)) {
      this._differ = this._iterableDiffers.find(value).create(this._cdr);
    }
  }

  set ngForVirtualTemplate(value: TemplateRef) { this._templateRef = value; }

  doCheck() {
    return;
    if (isPresent(this._differ)) {
      var changes = this._differ.diff(this._ngForOf);
      if (isPresent(changes)) this._applyChanges(changes);
    }
  }

  private _applyChanges(changes) {
    // TODO(rado): check if change detection can produce a change record that is
    // easier to consume than current.
    var recordViewTuples = [];
    changes.forEachRemovedItem((removedRecord) =>
                                   recordViewTuples.push(new RecordViewTuple(removedRecord, null)));

    changes.forEachMovedItem((movedRecord) =>
                                 recordViewTuples.push(new RecordViewTuple(movedRecord, null)));

    var insertTuples = this._bulkRemove(recordViewTuples);

    changes.forEachAddedItem((addedRecord) =>
                                 insertTuples.push(new RecordViewTuple(addedRecord, null)));

    this._bulkInsert(insertTuples);

    for (var i = 0; i < insertTuples.length; i++) {
      this._perViewChange(insertTuples[i].view, insertTuples[i].record);
    }

    for (var i = 0, ilen = this._viewContainer.length; i < ilen; i++) {
      this._viewContainer.get(i).setLocal('last', i === ilen - 1);
    }
  }

  private _perViewChange(view, record) {
    view.setLocal('\$implicit', record.item);
    view.setLocal('index', record.currentIndex);
    view.setLocal('even', (record.currentIndex % 2 == 0));
    view.setLocal('odd', (record.currentIndex % 2 == 1));
  }

  private _bulkRemove(tuples: RecordViewTuple[]): RecordViewTuple[] {
    tuples.sort((a, b) => a.record.previousIndex - b.record.previousIndex);
    var movedTuples = [];
    for (var i = tuples.length - 1; i >= 0; i--) {
      var tuple = tuples[i];
      // separate moved views from removed views.
      if (isPresent(tuple.record.currentIndex)) {
        tuple.view = this._viewContainer.detach(tuple.record.previousIndex);
        movedTuples.push(tuple);
      } else {
        this._viewContainer.remove(tuple.record.previousIndex);
      }
    }
    return movedTuples;
  }

  private _bulkInsert(tuples: RecordViewTuple[]): RecordViewTuple[] {
    tuples.sort((a, b) => a.record.currentIndex - b.record.currentIndex);
    for (var i = 0; i < tuples.length; i++) {
      var tuple = tuples[i];
      if (isPresent(tuple.view)) {
        this._viewContainer.insert(tuple.view, tuple.record.currentIndex);
      } else {
        tuple.view =
            this._viewContainer.createEmbeddedView(this._templateRef, tuple.record.currentIndex);
      }
    }
    return tuples;
  }
}

class RecordViewTuple {
  view: ViewRef;
  record: any;
  constructor(record, view) {
    this.record = record;
    this.view = view;
  }
}

class VirtualItemRef {
  constructor(item, index, realIndex, view) {
    this.item = item;
    this.index = index;
    this.realIndex = realIndex;
    this.view = view;
  }
}
