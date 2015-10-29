import {TemplateRef, ViewContainerRef} from 'angular2/angular2'
import {Directive, Host, forwardRef} from 'angular2/angular2';

import {App, List} from 'ionic/ionic';


/*
  Used to find and register headers in a view, and this directive's
  content will be moved up to the common navbar location, and created
  using the same context as the view's content area.
*/
@Directive({
  selector: 'template[cell]'
})
export class ItemCellTemplate {
  constructor(@Host() list: List, viewContainer: ViewContainerRef, templateRef: TemplateRef) {
    console.log('Item cell template', list, viewContainer, templateRef);

    this.protoViewRef = templateRef;
    this.viewContainer = viewContainer;

    list.setItemTemplate(this);
  }
}

@App({
  templateUrl: 'main.html',

  directives: [ItemCellTemplate]
})
class IonicApp {
  constructor() {

    this.items = []
    for(let i = 0; i < 1000; i++) {
      this.items.push({
        title: 'Item ' + i
      })
    }
  }
}
