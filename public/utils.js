/**
 * utils.js
 *
 * Super small javascript library that simplifies HTML document traversing,
 * event handling, ajax interactions and provides other functional utilities.
 *
 * utils.js depends on underscore.js
 *
 * Released under the MIT and GPL Licenses.
 *
 * ------------------------------------------------
 * author: Ziyu Wang
 * source: http://github.com/oddui/util.js/
 */

var utils = function () {
  'use strict';

  // base object
  var $ = (function () {

    // augmentations for element objects
    var aug = {};

    // getElements return an array of elements for given CSS selector in the
    // context of the given element or whole document.
    var getElements = function ( selector, context ) {
      context = context || document;
      return $.arrayify( context.querySelectorAll(selector) );
    };

    // this is the base object which is a function that returns an array of matching
    // elements. The returned array is augmented with methods from aug object.
    // I call the returned object as utils.js dom object.
    var $ = function (selector, context) {
      var elements;

      if (selector.nodeType === 1) {
        // an element is passed in assign it to el directly
        elements = [selector];
      } else if ($.toType(selector) === 'array') {
        elements = selector;
      } else {
        elements = getElements( selector, context );
      }

      // put aug methods into elements
      for (var prop in aug) {
        if (aug.hasOwnProperty(prop)) {
          elements[prop] = aug[prop];
        }
      }
      return elements;
    };

    $.aug = aug;

    return $;

  })();

  // common utils
  (function($) {

    // it's just an empty function ... and a useless comment.
    $.empty = function () { return false; };

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString#Using_toString_to_detect_object_type
    $.toType = function(obj) {
      return Object.prototype.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
    };

    // takes an array-like object and turns it into real Array
    // to make all the Array.prototype goodness available.
    $.arrayify = function (a) {
      return [].slice.call(a);
    };

    // this function should only be called on a utils.js dom object.
    // it will iterate through elements of the base object.
    // the element is passed as thisArg in callback
    $.aug.each = function(callback) {
      _(this).each(function(element, index) {
        return callback.call(element, element, index);
      });
      return this;
    };

    $.aug.filter = function(selector) {
      return $([].filter.call(this, function(element) {
        return element.parentNode &&
          _(element.parentNode.querySelectorAll(selector)).contains(element);
      }));
    };

  })($);

  // element
  (function($) {

    $.aug.remove = function() {
      return this.each(function() {
        if (this.parentNode !== null) {
          return this.parentNode.removeChild(this);
        }
      });
    };

  })($);

  // output
  (function($) {

    $.aug.append = function(value) {
      var type = $.toType(value);

      return this.each(function() {
        if (type === "string") {
          console.log('appending string');
          this.insertAdjacentHTML("beforeend", value);
        } else if (type === "array") {
          console.log('appending elements');
          _(value).each(function(value, index) {
            console.log(this);
            console.log(value);
            this.appendChild(value);
          }, this);
        } else {
          console.log('appending element');
          this.appendChild(value);
        }
      });
    };

  })($);

  // styles
  (function($) {

    // `pfx` is a function that takes a standard CSS property name as a parameter
    // and returns it's prefixed version valid for current browser it runs in.
    // The code is heavily inspired by Modernizr http://www.modernizr.com/
    var pfx = (function () {

      var style = document.createElement('dummy').style,
      prefixes = 'Webkit Moz O ms Khtml'.split(' '),
      memory = {};

      return function ( prop ) {
        if ( typeof memory[ prop ] === "undefined" ) {

          var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1),
          props = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');

          memory[ prop ] = null;
          for ( var i in props ) {
            if ( style[ props[i] ] !== undefined ) {
              memory[ prop ] = props[i];
              break;
            }
          }

        }
        return memory[ prop ];
      };

    })();

    // `css` function applies the styles given in `props` object to the element
    // given as `el`. It runs all property names through `pfx` function to make
    // sure proper prefixed version of the property is used.
    $.css = function ( el, props ) {
      var key, pkey;
      for ( key in props ) {
        if ( props.hasOwnProperty(key) ) {
          pkey = pfx(key);
          if ( pkey !== null ) {
            el.style[pkey] = props[key];
          }
        }
      }
      return el;
    };

    $.aug.css = function(props) {
      this.each(function() {
        $.css(this, props);
      });
      return this;
    };

  })($);

  // events
  (function($) {
  })($);

  // ajax
  (function($) {
    var DEFAULT, MIME_TYPES, JSONP_ID;

    DEFAULT = {
      TYPE: "GET",
      MIME: "json"
    };

    MIME_TYPES = {
      script: "text/javascript, application/javascript",
      json: "application/json",
      xml: "application/xml, text/xml",
      html: "text/html",
      text: "text/plain"
    };

    JSONP_ID = 0;

    $.defaultOptions = {
      type: DEFAULT.TYPE,
      async: true,
      success: function(response, xhr, settings) { return false; },
      error: function(type, xhr, settings) { return false; },
      context: null,
      dataType: DEFAULT.MIME,
      headers: {},
      xhr: function() {
        return new window.XMLHttpRequest();
      },
      crossDomain: false,
      timeout: 0
    };

    $.ajax = function(options) {
      var abortTimeout, settings, xhr;

      // merge defaultOptions and options
      settings = _({}).extend($.defaultOptions, options);

      if (settings.type === DEFAULT.TYPE) {
        settings.url += $.serializeParameters(settings.data, "?");
      } else {
        settings.data = $.serializeParameters(settings.data);
      }
      if (isJsonP(settings.url)) {
        return $.jsonp(settings);
      }
      xhr = settings.xhr();
      xhr.onreadystatechange = function() {
        //console.log(xhr.readyState);
        if (xhr.readyState === 4) {
          clearTimeout(abortTimeout);
          xhrStatus(xhr, settings);
        }
      };
      xhr.open(settings.type, settings.url, settings.async);
      xhrHeaders(xhr, settings);
      abortTimeout = xhrTimeout(xhr, settings);
      try {
        xhr.send(settings.data);
      } catch (error) {
        xhrError("Resource not found", xhr, settings);
      }
      if (settings.async) {
        return xhr;
      } else {
        return parseResponse(xhr, settings);
      }
    };

    $.jsonp = function(settings) {
      var abortTimeout, callbackName, script, xhr;

      if (settings.async) {
        callbackName = "jsonp" + (++JSONP_ID);
        script = document.createElement("script");
        // make a fake xhr object
        xhr = {
          abort: function() {
            $(script).remove();
            delete window[callbackName];
          },
          callbackName: callbackName
        };
        window[callbackName] = function(response) {
          clearTimeout(abortTimeout);
          xhr.abort();
          xhrSuccess(response, xhr, settings);
        };
        script.src = settings.url.replace((new RegExp("=\\?")), "=" + callbackName);
        $("head").append(script);
        abortTimeout = xhrTimeout(xhr, settings);
        return xhr;
      } else {
        return console.error("ajax: Unable to make jsonp synchronous call.");
      }
    };

    $.get = function(url, data, success, dataType) {
      return $.ajax({
        url: url,
        data: data,
        success: success,
        dataType: dataType
      });
    };

    $.post = function(url, data, success, dataType) {
      return xhrForm("POST", url, data, success, dataType);
    };

    $.put = function(url, data, success, dataType) {
      return xhrForm("PUT", url, data, success, dataType);
    };

    $["delete"] = function(url, data, success, dataType) {
      return xhrForm("DELETE", url, data, success, dataType);
    };

    $.json = function(url, data, success) {
      return $.get(url, data, success, DEFAULT.MIME);
    };

    $.serializeParameters = function(parameters, character) {
      var parameter, serialize;

      if (_(character).isUndefined()) {
        character = "";
      }
      serialize = character;
      for (parameter in parameters) {
        if (parameters.hasOwnProperty(parameter)) {
          if (serialize !== character) {
            serialize += "&";
          }
          serialize += (encodeURIComponent(parameter)) + "=" + (encodeURIComponent(parameters[parameter]));
        }
      }
      return (serialize === character) ? "" : serialize;
    };

    var xhrSuccess = function(response, xhr, settings) {
      settings.success.call(settings.context, response, xhr, settings);
    };

    var xhrError = function(type, xhr, settings) {
      settings.error.call(settings.context, type, xhr, settings);
    };

    var xhrStatus = function(xhr, settings) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
        if (settings.async) {
          xhrSuccess(parseResponse(xhr, settings), xhr, settings);
        }
      } else {
        xhrError("ajax: Unsuccessful request", xhr, settings);
      }
    };

    var xhrHeaders = function(xhr, settings) {
      // contentType and dataType can be set in options or options.headers
      if (settings.contentType) {
        settings.headers["Content-Type"] = settings.contentType;
      }
      if (settings.dataType) {
        settings.headers.Accept = MIME_TYPES[settings.dataType];
      }

      for (var header in settings.headers) {
        xhr.setRequestHeader(header, settings.headers[header]);
      }
    };

    var xhrTimeout = function(xhr, settings) {
      if (settings.timeout > 0) {
        return setTimeout((function() {
          xhr.onreadystatechange = {};
          xhr.abort();
          xhrError("ajax: Timeout exceeded", xhr, settings);
        }), settings.timeout);
      }
    };

    var xhrForm = function(method, url, data, success, dataType) {
      return $.ajax({
        type: method,
        url: url,
        data: data,
        success: success,
        dataType: dataType,
        contentType: "application/x-www-form-urlencoded"
      });
    };

    // parse xhr responseText according to dataType specified in settings
    // this does not honor the Content-Type from the http response headers
    var parseResponse = function(xhr, settings) {
      var error, response;

      response = xhr.responseText;
      if (response) {
        if (settings.dataType === DEFAULT.MIME) {
          try {
            response = JSON.parse(response);
          } catch (_error) {
            error = _error;
            response = error;
            xhrError("ajax: Parse Error", xhr, settings);
          }
        } else {
          if (settings.dataType === "xml") {
            response = xhr.responseXML;
          }
        }
      }
      return response;
    };

    var isJsonP = function(url) {
      return (new RegExp("=\\?")).test(url);
    };

  })($);

  // environment
  (function($) {

    var IS_WEBKIT, IS_MOBILE, SUPPORTED_OS, env ;

    env = null;
    IS_WEBKIT = /WebKit\/([\d.]+)/;
    IS_MOBILE = /Mobile|Android|BlackBerry|(webOS|hpwOS)/;
    SUPPORTED_OS = {
      Android: /(Android)\s+([\d.]+)/,
      ipad: /(iPad).*OS\s([\d_]+)/,
      iphone: /(iPhone\sOS)\s([\d_]+)/,
      Blackberry: /(BlackBerry|BB10|Playbook).*Version\/([\d.]+)/,
      FirefoxOS: /(Mozilla).*Mobile[^\/]*\/([\d\.]*)/,
      webOS: /(webOS|hpwOS)[\s\/]([\d.]+)/
    };

    var detectBrowser = function(userAgent) {
      var is_webkit;

      is_webkit = userAgent.match(IS_WEBKIT);
      if (is_webkit) {
        return is_webkit[0];
      } else {
        return userAgent;
      }
    };

    var detectOS = function(userAgent) {
      var detected_os, os, supported;

      detected_os = null;
      for (os in SUPPORTED_OS) {
        supported = userAgent.match(SUPPORTED_OS[os]);
        if (supported) {
          detected_os = {
            name: (os === "iphone" || os === "ipad" ? "ios" : os),
            version: supported[2].replace("_", ".")
          };
          break;
        }
      }
      return detected_os;
    };

    var detectScreen = function() {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    };

    var detectEnvironment = function() {
      var env, userAgent;

      userAgent = navigator.userAgent;
      env = {};
      env.browser = detectBrowser(userAgent);
      env.os = detectOS(userAgent);
      env.screen = detectScreen();
      return env;
    };

    $.environment = function() {
      env = env || detectEnvironment();
      return env;
    };
    $.isMobile = function() {
      return IS_MOBILE.test(navigator.userAgent);
    };
    $.isTouchDevice = function () {
      return !!('ontouchstart' in window) || // works on most browsers
        !!('onmsgesturechange' in window); // works on ie10
    };
    $.isOnline = function() {
      return navigator.onLine;
    };
  })($);

  // test browser support
  (function($) {

    $.isSupported = (true) &&
      (true);

  })($);

  return $.isSupported ? $ : undefined;
};
