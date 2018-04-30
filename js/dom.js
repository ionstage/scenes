(function(app) {
  'use strict';

  var dom = {};

  dom.body = function() {
    return document.body;
  };

  dom.render = function(s) {
    var el = document.createRange().createContextualFragment(s).firstChild;
    el.parentNode.removeChild(el);
    return el;
  };

  dom.children = function(el) {
    return Array.prototype.slice.call(el.children);
  };

  dom.append = function(parent, child) {
    parent.appendChild(child);
  };

  dom.css = function(el, props) {
    var style = el.style;
    Object.keys(props).forEach(function(key) {
      style[key] = props[key];
    });
  };

  dom.toggleClass = function(el, className, force) {
    if (force) {
      el.classList.add(className);
    } else {
      el.classList.remove(className);
    }
  };

  dom.data = function(el, key, value) {
    el.dataset[key] = value;
  };

  dom.transform = function(el, value) {
    dom.css(el, {
      transform: value,
      webkitTransform: value,
    });
  };

  dom.translate = function(el, x, y) {
    dom.transform(el, 'translate(' + x + 'px, ' + y + 'px)');
  };

  dom.on = function(el, type, listener, useCapture) {
    el.addEventListener(type, listener, !!useCapture);
  };

  dom.off = function(el, type, listener, useCapture) {
    el.removeEventListener(type, listener, !!useCapture);
  };

  dom.once = function(el, type, listener, useCapture) {
    var wrapper = function() {
      dom.off(el, type, wrapper, useCapture);
      listener.apply(null, arguments);
    };
    dom.on(el, type, wrapper, useCapture);
  };

  dom.supportsTouch = function() {
    return ('createTouch' in document);
  };

  dom.changedTouch = function(event) {
    return (dom.supportsTouch() && 'changedTouches' in event ? event.changedTouches[0] : null);
  };

  dom.target = function(event) {
    var touch = dom.changedTouch(event);
    return (touch ? document.elementFromPoint(touch.clientX, touch.clientY) : event.target);
  };

  dom.cancel = function(event) {
    event.preventDefault();
  };

  dom.ajax = function(opt) {
    var type = opt.type;
    var url = opt.url;

    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();

      var onfailed = function() {
        reject(new Error('Failed to load resource: ' + type + ' ' + url));
      };

      req.onload = function() {
        if (req.status >= 200 && req.status < 400) {
          resolve(req.response);
        } else {
          onfailed();
        }
      };

      req.onerror = onfailed;
      req.onabort = onfailed;

      req.open(type, url, true);
      req.send();
    });
  };

  dom.loadScript = function(url) {
    return dom.ajax({ type: 'GET', url: url }).then(function(text) {
      var el = document.createElement('script');
      el.textContent = text;
      document.body.appendChild(el);
      document.body.removeChild(el);
    });
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = dom;
  } else {
    app.dom = dom;
  }
})(this.app || (this.app = {}));
