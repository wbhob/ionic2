import {
  DomRenderer,
  DOCUMENT,
  EVENT_MANAGER_PLUGINS,
  EventManager,
  DOM,
  DomSharedStylesHost
} from 'angular2/platform/common_dom';

import {
  PLATFORM_DIRECTIVES,
  PLATFORM_PIPES,
  ComponentRef,
  platform,
  ExceptionHandler,
  Reflector,
  reflector,
  APPLICATION_COMMON_PROVIDERS,
  PLATFORM_COMMON_PROVIDERS,
  Renderer,
  PLATFORM_INITIALIZER,
  APP_INITIALIZER,
  Inject,
  Injectable,
  OpaqueToken
} from 'angular2/core';

import {AnimationBuilder} from 'angular2/src/animate/animation_builder';

import {
  isPresent,
  isBlank,
  RegExpWrapper,
  CONST_EXPR,
  stringify,
  StringWrapper
} from 'angular2/src/facade/lang';

import {BaseException, WrappedException} from 'angular2/src/facade/exceptions';
import {WtfScopeFn, wtfLeave, wtfCreateScope} from 'angular2/src/core/profile/profile';

import {
  Renderer,
  RenderProtoViewRef,
  RenderViewRef,
  RenderElementRef,
  RenderFragmentRef,
  RenderViewWithFragments,
  RenderTemplateCmd,
  RenderComponentTemplate
} from 'angular2/core';

import {
  createRenderView,
  encapsulateStyles
} from 'angular2/src/core/render/view_factory';
import {
  DefaultRenderView,
  DefaultRenderFragmentRef,
  DefaultProtoViewRef
} from 'angular2/src/core/render/view';

import {ViewEncapsulation} from 'angular2/src/core/metadata';

const NAMESPACE_URIS =
    CONST_EXPR({'xlink': 'http://www.w3.org/1999/xlink', 'svg': 'http://www.w3.org/2000/svg'});


@Injectable()
export class IonicDomRenderer extends DomRenderer {
  private _componentTpls: Map<string, RenderComponentTemplate> =
      new Map<string, RenderComponentTemplate>();
  private _document;

  constructor(private _eventManager: EventManager,
              private _domSharedStylesHost: DomSharedStylesHost,
              private _animate: AnimationBuilder,
              @Inject(DOCUMENT) document) {
    super();
    this._document = document;
  }

  registerComponentTemplate(template: RenderComponentTemplate) {
    this._componentTpls.set(template.id, template);
    if (template.encapsulation !== ViewEncapsulation.Native) {
      var encapsulatedStyles = encapsulateStyles(template);
      this._domSharedStylesHost.addStyles(encapsulatedStyles);
    }
  }

  createProtoView(componentTemplateId: string, cmds: RenderTemplateCmd[]): RenderProtoViewRef {
    return new DefaultProtoViewRef(this._componentTpls.get(componentTemplateId), cmds);
  }

  resolveComponentTemplate(templateId: string): RenderComponentTemplate {
    return this._componentTpls.get(templateId);
  }

  /** @internal */
  _createRootHostViewScope: WtfScopeFn = wtfCreateScope('DomRenderer#createRootHostView()');
  createRootHostView(hostProtoViewRef: RenderProtoViewRef, fragmentCount: number,
                     hostElementSelector: string): RenderViewWithFragments {
    var s = this._createRootHostViewScope();
    var element = DOM.querySelector(this._document, hostElementSelector);
    if (isBlank(element)) {
      wtfLeave(s);
      throw new BaseException(`The selector "${hostElementSelector}" did not match any elements`);
    }
    return wtfLeave(s, this._createView(hostProtoViewRef, element));
  }

  /** @internal */
  _createViewScope = wtfCreateScope('DomRenderer#createView()');
  createView(protoViewRef: RenderProtoViewRef, fragmentCount: number): RenderViewWithFragments {
    var s = this._createViewScope();
    return wtfLeave(s, this._createView(protoViewRef, null));
  }

  private _createView(protoViewRef: RenderProtoViewRef,
                      inplaceElement: HTMLElement): RenderViewWithFragments {
    var dpvr = <DefaultProtoViewRef>protoViewRef;
    var view = createRenderView(dpvr.template, dpvr.cmds, inplaceElement, this);
    var sdRoots = view.nativeShadowRoots;
    for (var i = 0; i < sdRoots.length; i++) {
      this._domSharedStylesHost.addHost(sdRoots[i]);
    }
    return new RenderViewWithFragments(view, view.fragments);
  }

  destroyView(viewRef: RenderViewRef) {
    var view = <DefaultRenderView<Node>>viewRef;
    var sdRoots = view.nativeShadowRoots;
    for (var i = 0; i < sdRoots.length; i++) {
      this._domSharedStylesHost.removeHost(sdRoots[i]);
    }
  }

  animateNodeEnter(node: Node) {
    if (DOM.isElementNode(node) && DOM.hasClass(node, 'ng-animate')) {
      DOM.addClass(node, 'ng-enter');
      this._animate.css()
          .addAnimationClass('ng-enter-active')
          .start(<HTMLElement>node)
          .onComplete(() => { DOM.removeClass(node, 'ng-enter'); });
    }
  }

  animateNodeLeave(node: Node) {
    if (DOM.isElementNode(node) && DOM.hasClass(node, 'ng-animate')) {
      DOM.addClass(node, 'ng-leave');
      this._animate.css()
          .addAnimationClass('ng-leave-active')
          .start(<HTMLElement>node)
          .onComplete(() => {
            DOM.removeClass(node, 'ng-leave');
            DOM.remove(node);
          });
    } else {
      DOM.remove(node);
    }
  }

  /** @internal */
  _detachFragmentScope = wtfCreateScope('DomRenderer#detachFragment()');
  detachFragment(fragmentRef: RenderFragmentRef) {
    var s = this._detachFragmentScope();
    var fragmentNodes = resolveInternalDomFragment(fragmentRef);
    for (var i = 0; i < fragmentNodes.length; i++) {
      this.animateNodeLeave(fragmentNodes[i]);
    }
    wtfLeave(s);
  }
  createElement(name: string, attrNameAndValues: string[]): Node {
    var nsAndName = splitNamespace(name);
    var el = isPresent(nsAndName[0]) ?
                 DOM.createElementNS(NAMESPACE_URIS[nsAndName[0]], nsAndName[1]) :
                 DOM.createElement(nsAndName[1]);
    this._setAttributes(el, attrNameAndValues);
    return el;
  }
  mergeElement(existing: Node, attrNameAndValues: string[]) {
    DOM.clearNodes(existing);
    this._setAttributes(existing, attrNameAndValues);
  }
  private _setAttributes(node: Node, attrNameAndValues: string[]) {
    for (var attrIdx = 0; attrIdx < attrNameAndValues.length; attrIdx += 2) {
      var attrNs;
      var attrName = attrNameAndValues[attrIdx];
      var nsAndName = splitNamespace(attrName);
      if (isPresent(nsAndName[0])) {
        attrName = nsAndName[0] + ':' + nsAndName[1];
        attrNs = NAMESPACE_URIS[nsAndName[0]];
      }
      var attrValue = attrNameAndValues[attrIdx + 1];
      if (isPresent(attrNs)) {
        DOM.setAttributeNS(node, attrNs, attrName, attrValue);
      } else {
        DOM.setAttribute(node, nsAndName[1], attrValue);
      }
    }
  }
  createRootContentInsertionPoint(): Node {
    return DOM.createComment('root-content-insertion-point');
  }
  createShadowRoot(host: Node, templateId: string): Node {
    var sr = DOM.createShadowRoot(host);
    var tpl = this._componentTpls.get(templateId);
    for (var i = 0; i < tpl.styles.length; i++) {
      DOM.appendChild(sr, DOM.createStyleElement(tpl.styles[i]));
    }
    return sr;
  }
  on(element: Node, eventName: string, callback: Function) {
    this._eventManager.addEventListener(<HTMLElement>element, eventName,
                                        decoratePreventDefault(callback));
  }
  globalOn(target: string, eventName: string, callback: Function): Function {
    return this._eventManager.addGlobalEventListener(target, eventName,
                                                     decoratePreventDefault(callback));
  }
}

function resolveInternalDomView(viewRef: RenderViewRef): DefaultRenderView<Node> {
  return <DefaultRenderView<Node>>viewRef;
}

function resolveInternalDomFragment(fragmentRef: RenderFragmentRef): Node[] {
  return (<DefaultRenderFragmentRef<Node>>fragmentRef).nodes;
}

function moveNodesAfterSibling(sibling, nodes) {
  if (nodes.length > 0 && isPresent(DOM.parentElement(sibling))) {
    for (var i = 0; i < nodes.length; i++) {
      DOM.insertBefore(sibling, nodes[i]);
    }
    DOM.insertBefore(nodes[0], sibling);
  }
}

function decoratePreventDefault(eventHandler: Function): Function {
  return (event) => {
    var allowDefaultBehavior = eventHandler(event);
    if (!allowDefaultBehavior) {
      // TODO(tbosch): move preventDefault into event plugins...
      DOM.preventDefault(event);
    }
  };
}

var NS_PREFIX_RE = /^@([^:]+):(.+)/g;

function splitNamespace(name: string): string[] {
  if (name[0] != '@') {
    return [null, name];
  }
  let match = RegExpWrapper.firstMatch(NS_PREFIX_RE, name);
  return [match[1], match[2]];
}
