// Run any post export code

import {Engine} from 'ionic/engine/engine';

let windowLoadListenderAttached = false;

// setup listeners to know when the device is ready to go
function onWindowLoad() {
  //alert('Window load' + window.cordova);
  if (Engine.is('webview')) {
    //alert('IS WEB VIEW');
    // the window and scripts are fully loaded, and a cordova/phonegap
    // object exists then let's listen for the deviceready
    document.addEventListener("deviceready", onPlatformReady, false);
  } else {
    // the window and scripts are fully loaded, but the window object doesn't have the
    // cordova/phonegap object, so its just a browser, not a webview wrapped w/ cordova
    onPlatformReady();
  }
  if (windowLoadListenderAttached) {
    window.removeEventListener("load", onWindowLoad, false);
  }
}

setTimeout(() => {
  if (document.readyState === 'complete') {
    onWindowLoad();
  } else {
    windowLoadListenderAttached = true;
    window.addEventListener("load", onWindowLoad, false);
  }
}, 1000);

function onPlatformReady() {
  Engine.set(Engine.detect());

  //alert('Platform ready');

  // the device is all set to go, init our own stuff then fire off our event

  /*
  self.isReady = true;
  self.detect();
  for (var x = 0; x < readyCallbacks.length; x++) {
    // fire off all the callbacks that were added before the platform was ready
    readyCallbacks[x]();
  }
  readyCallbacks = [];
  ionic.trigger('platformready', { target: document });

  requestAnimationFrame(function() {
    document.body.classList.add('platform-ready');
  });
  */
}
