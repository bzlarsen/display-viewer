/*
 * Display Viewer: message for iPads too old to run the app (e.g. iPad mini 1 on iOS 9).
 * Plain ES5 so it runs on very old Safari. Browsers that understand <script type="module">
 * skip this file (it's loaded with `nomodule`), except Safari 10.1, which runs both — so we
 * also check for `noModule` support ourselves. Nothing is sent anywhere.
 */
(function () {
  var s = document.createElement('script');
  if ('noModule' in s) return; // modern browser: the real app runs instead
  var ua = navigator.userAgent || '';
  var m = /OS (\d+)_(\d+)/.exec(ua);
  var ver = m ? 'iOS ' + m[1] + '.' + m[2] : 'this version of iOS';
  function show() {
    var app = document.getElementById('app') || document.body;
    while (app.firstChild) app.removeChild(app.firstChild);
    var box = document.createElement('div');
    box.className = 'too-old';
    box.setAttribute('data-id', 'too-old');
    var h = document.createElement('h1');
    h.appendChild(document.createTextNode('This iPad is too old for the camera features'));
    var p1 = document.createElement('p');
    p1.appendChild(document.createTextNode(
      'This iPad has ' + ver + '. Display Viewer needs the camera in Safari, which arrived in iOS 11 ' +
      '(iPad mini 2 or newer). The iPad mini 1 can\u2019t be updated past iOS 9, so it can\u2019t run this app.'));
    var p2 = document.createElement('p');
    p2.appendChild(document.createTextNode('Please use a newer iPad. Nothing was sent anywhere.'));
    box.appendChild(h);
    box.appendChild(p1);
    box.appendChild(p2);
    app.appendChild(box);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
  else show();
})();
