(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("UniversalEmbedCustom", [], factory);
	else if(typeof exports === 'object')
		exports["UniversalEmbedCustom"] = factory();
	else
		root["UniversalEmbedCustom"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ },
/* 1 */
/***/ function(module, exports) {

"use strict";
/**
 * @copyright 2015, Andrey Popp <8mayday@gmail.com>
 *
 * The decorator may be used on classes or methods
 * ```
 * @autobind
 * class FullBound {}
 *
 * class PartBound {
 *   @autobind
 *   method () {}
 * }
 * ```
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = autobind;

function autobind() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 1) {
    return boundClass.apply(undefined, args);
  } else {
    return boundMethod.apply(undefined, args);
  }
}

/**
 * Use boundMethod to bind all methods on the target.prototype
 */
function boundClass(target) {
  // (Using reflect to get all keys including symbols)
  var keys = undefined;
  // Use Reflect if exists
  if (typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function') {
    keys = Reflect.ownKeys(target.prototype);
  } else {
    keys = Object.getOwnPropertyNames(target.prototype);
    // use symbols if support is provided
    if (typeof Object.getOwnPropertySymbols === 'function') {
      keys = keys.concat(Object.getOwnPropertySymbols(target.prototype));
    }
  }

  keys.forEach(function (key) {
    // Ignore special case target method
    if (key === 'constructor') {
      return;
    }

    var descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);

    // Only methods need binding
    if (typeof descriptor.value === 'function') {
      Object.defineProperty(target.prototype, key, boundMethod(target, key, descriptor));
    }
  });
  return target;
}

/**
 * Return a descriptor removing the value and returning a getter
 * The getter will return a .bind version of the function
 * and memoize the result against a symbol on the instance
 */
function boundMethod(target, key, descriptor) {
  var fn = descriptor.value;

  if (typeof fn !== 'function') {
    throw new Error('@autobind decorator can only be applied to methods not: ' + typeof fn);
  }

  return {
    configurable: true,
    get: function get() {
      if (this === target.prototype || this.hasOwnProperty(key)) {
        return fn;
      }

      var boundFn = fn.bind(this);
      Object.defineProperty(this, key, {
        value: boundFn,
        configurable: true,
        writable: true
      });
      return boundFn;
    }
  };
}
module.exports = exports['default'];


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store__ = __webpack_require__(3);

/* harmony export */ __webpack_require__.d(exports, "a", function() { return BaseComponent; });var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



// Ends with brackets e.g. [data-ref="foo[]"]
var ARRAY_REF_PATTERN = /([a-zA-Z\d]*)(\[?\]?)/;

var BaseComponent = (_temp = _class = function () {
  function BaseComponent() {
    var spec = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseComponent);

    this.element = null;
    this.refs = {};
    this.serializer = document.createElement("div");
    this.store = __WEBPACK_IMPORTED_MODULE_0__store__["a" /* default */];
    var stylesheet = this.constructor.stylesheet;
    var iframeDocument = __WEBPACK_IMPORTED_MODULE_0__store__["a" /* default */].iframe.document;


    Object.assign(this, spec);

    if (stylesheet && !this.constructor.style) {
      var style = this.constructor.style = iframeDocument.createElement("style");

      style.innerHTML = stylesheet;
      iframeDocument.head.appendChild(style);
    }
  }

  _createClass(BaseComponent, [{
    key: "autofocus",
    value: function autofocus() {
      var focusElement = this.element.querySelector("[autofocus]");

      if (focusElement) focusElement.focus();
    }

    // NOTE: Calling `updateRefs` multiple times from different tree depths may
    // allow parents to inherit a grandchild.

  }, {
    key: "updateRefs",
    value: function updateRefs() {
      var refs = this.refs;


      Array.from(this.element.querySelectorAll("[data-ref]")).forEach(function (element) {
        var attribute = element.getAttribute("data-ref");

        var _attribute$match = attribute.match(ARRAY_REF_PATTERN);

        var _attribute$match2 = _slicedToArray(_attribute$match, 3);

        var key = _attribute$match2[1];
        var arrayKey = _attribute$match2[2];


        if (arrayKey) {
          // Multiple elements
          if (!Array.isArray(refs[key])) refs[key] = [];

          refs[key].push(element);
        } else {
          // Single element
          refs[key] = element;
        }

        element.removeAttribute("data-ref");
      });
    }
  }, {
    key: "compileTemplate",
    value: function compileTemplate() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var template = this.constructor.template;


      if (typeof template === "function") {
        this.serializer.innerHTML = template(_extends({ config: __WEBPACK_IMPORTED_MODULE_0__store__["a" /* default */] }, options));
      } else {
        this.serializer.innerHTML = template;
      }

      this.element = this.serializer.firstChild;
      this.updateRefs();

      return this.element;
    }
  }, {
    key: "insertBefore",
    value: function insertBefore(sibling, element) {
      element.parentNode.insertBefore(sibling, element);
    }
  }, {
    key: "render",
    value: function render() {
      return this.compileTemplate();
    }

    // TODO: Check if this used after the app is fleshed out.

  }, {
    key: "replaceElement",
    value: function replaceElement(current, next) {
      current.parentNode.insertBefore(next, current);
      current.parentNode.removeChild(current);

      this.updateRefs();
    }
  }]);

  return BaseComponent;
}(), _class.template = null, _class.stylesheet = null, _temp);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var iframe = document.createElement("iframe");

/* harmony default export */ exports["a"] = {
  appName: "Drift Chat",
  siteId: "Icc0-PIkXF",

  selectedId: "",
  page: "home",

  iframe: {
    element: iframe,
    get document() {
      return iframe.contentDocument;
    },
    get window() {
      return iframe.contentWindow;
    }
  },

  labels: {
    done: "Done",
    searchPlaceholder: "Select or search the type of website you have...",
    next: "Next",
    title: function title(appName) {
      return "Add " + appName + " to your site";
    }
  }
};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_base_component__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__close_svg__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__close_svg___default = __WEBPACK_IMPORTED_MODULE_1__close_svg__ && __WEBPACK_IMPORTED_MODULE_1__close_svg__.__esModule ? function() { return __WEBPACK_IMPORTED_MODULE_1__close_svg__['default'] } : function() { return __WEBPACK_IMPORTED_MODULE_1__close_svg__; };
/* harmony import */ __webpack_require__.d(__WEBPACK_IMPORTED_MODULE_1__close_svg___default, 'a', __WEBPACK_IMPORTED_MODULE_1__close_svg___default);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__drupal_svg__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__drupal_svg___default = __WEBPACK_IMPORTED_MODULE_2__drupal_svg__ && __WEBPACK_IMPORTED_MODULE_2__drupal_svg__.__esModule ? function() { return __WEBPACK_IMPORTED_MODULE_2__drupal_svg__['default'] } : function() { return __WEBPACK_IMPORTED_MODULE_2__drupal_svg__; };
/* harmony import */ __webpack_require__.d(__WEBPACK_IMPORTED_MODULE_2__drupal_svg___default, 'a', __WEBPACK_IMPORTED_MODULE_2__drupal_svg___default);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__embed_svg__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__embed_svg___default = __WEBPACK_IMPORTED_MODULE_3__embed_svg__ && __WEBPACK_IMPORTED_MODULE_3__embed_svg__.__esModule ? function() { return __WEBPACK_IMPORTED_MODULE_3__embed_svg__['default'] } : function() { return __WEBPACK_IMPORTED_MODULE_3__embed_svg__; };
/* harmony import */ __webpack_require__.d(__WEBPACK_IMPORTED_MODULE_3__embed_svg___default, 'a', __WEBPACK_IMPORTED_MODULE_3__embed_svg___default);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__joomla_svg__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__joomla_svg___default = __WEBPACK_IMPORTED_MODULE_4__joomla_svg__ && __WEBPACK_IMPORTED_MODULE_4__joomla_svg__.__esModule ? function() { return __WEBPACK_IMPORTED_MODULE_4__joomla_svg__['default'] } : function() { return __WEBPACK_IMPORTED_MODULE_4__joomla_svg__; };
/* harmony import */ __webpack_require__.d(__WEBPACK_IMPORTED_MODULE_4__joomla_svg___default, 'a', __WEBPACK_IMPORTED_MODULE_4__joomla_svg___default);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__previous_svg__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__previous_svg___default = __WEBPACK_IMPORTED_MODULE_5__previous_svg__ && __WEBPACK_IMPORTED_MODULE_5__previous_svg__.__esModule ? function() { return __WEBPACK_IMPORTED_MODULE_5__previous_svg__['default'] } : function() { return __WEBPACK_IMPORTED_MODULE_5__previous_svg__; };
/* harmony import */ __webpack_require__.d(__WEBPACK_IMPORTED_MODULE_5__previous_svg___default, 'a', __WEBPACK_IMPORTED_MODULE_5__previous_svg___default);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__search_svg__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__search_svg___default = __WEBPACK_IMPORTED_MODULE_6__search_svg__ && __WEBPACK_IMPORTED_MODULE_6__search_svg__.__esModule ? function() { return __WEBPACK_IMPORTED_MODULE_6__search_svg__['default'] } : function() { return __WEBPACK_IMPORTED_MODULE_6__search_svg__; };
/* harmony import */ __webpack_require__.d(__WEBPACK_IMPORTED_MODULE_6__search_svg___default, 'a', __WEBPACK_IMPORTED_MODULE_6__search_svg___default);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__wordpress_svg__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__wordpress_svg___default = __WEBPACK_IMPORTED_MODULE_7__wordpress_svg__ && __WEBPACK_IMPORTED_MODULE_7__wordpress_svg__.__esModule ? function() { return __WEBPACK_IMPORTED_MODULE_7__wordpress_svg__['default'] } : function() { return __WEBPACK_IMPORTED_MODULE_7__wordpress_svg__; };
/* harmony import */ __webpack_require__.d(__WEBPACK_IMPORTED_MODULE_7__wordpress_svg___default, 'a', __WEBPACK_IMPORTED_MODULE_7__wordpress_svg___default);

/* harmony export */ __webpack_require__.d(exports, "close", function() { return close; });
/* harmony export */ __webpack_require__.d(exports, "drupal", function() { return drupal; });
/* harmony export */ __webpack_require__.d(exports, "embed", function() { return embed; });
/* harmony export */ __webpack_require__.d(exports, "joomla", function() { return joomla; });
/* harmony export */ __webpack_require__.d(exports, "previous", function() { return previous; });
/* harmony export */ __webpack_require__.d(exports, "search", function() { return search; });
/* harmony export */ __webpack_require__.d(exports, "wordpress", function() { return wordpress; });var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var toComponent = function toComponent(template) {
  var _class, _temp;

  return _temp = _class = function (_BaseComponent) {
    _inherits(Icon, _BaseComponent);

    function Icon() {
      var attributes = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, Icon);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Icon).call(this));

      _this.attributes = _extends({ class: "icon" }, attributes);
      return _this;
    }

    _createClass(Icon, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var element = this.compileTemplate();

        Object.keys(this.attributes).forEach(function (key) {
          return element.setAttribute(key, _this2.attributes[key]);
        });

        return element;
      }
    }]);

    return Icon;
  }(__WEBPACK_IMPORTED_MODULE_0_components_base_component__["a" /* default */]), _class.template = template, _temp;
};


var close = toComponent(__WEBPACK_IMPORTED_MODULE_1__close_svg___default.a);


var drupal = toComponent(__WEBPACK_IMPORTED_MODULE_2__drupal_svg___default.a);


var embed = toComponent(__WEBPACK_IMPORTED_MODULE_3__embed_svg___default.a);


var joomla = toComponent(__WEBPACK_IMPORTED_MODULE_4__joomla_svg___default.a);


var previous = toComponent(__WEBPACK_IMPORTED_MODULE_5__previous_svg___default.a);


var search = toComponent(__WEBPACK_IMPORTED_MODULE_6__search_svg___default.a);


var wordpress = toComponent(__WEBPACK_IMPORTED_MODULE_7__wordpress_svg___default.a);

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = {
  backspace: 8,
  enter: 13,
  esc: 27,
  left: 37,
  up: 38,
  right: 39,
  down: 40
};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return (Array.isArray(val) ? val.map(joinClasses) :
    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
    [val]).filter(nulls).join(' ');
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};


exports.style = function (val) {
  if (val && typeof val === 'object') {
    return Object.keys(val).map(function (style) {
      return style + ':' + val[style];
    }).join(';');
  } else {
    return val;
  }
};
/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if (key === 'style') {
    val = exports.style(val);
  }
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    if (JSON.stringify(val).indexOf('&') !== -1) {
      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
                   'will be escaped to `&amp;`');
    };
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will eliminate the double quotes around dates in ' +
                   'ISO form after 2.0.0');
    }
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

var jade_encode_html_rules = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};
var jade_match_html = /[&<>"]/g;

function jade_encode_char(c) {
  return jade_encode_html_rules[c] || c;
}

exports.escape = jade_escape;
function jade_escape(html){
  var result = String(html).replace(jade_match_html, jade_encode_char);
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || __webpack_require__(31).readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

exports.DebugItem = function DebugItem(lineno, filename) {
  this.lineno = lineno;
  this.filename = filename;
}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__eager_universal_embed_styl__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__eager_universal_embed_styl___default = __WEBPACK_IMPORTED_MODULE_0__eager_universal_embed_styl__ && __WEBPACK_IMPORTED_MODULE_0__eager_universal_embed_styl__.__esModule ? function() { return __WEBPACK_IMPORTED_MODULE_0__eager_universal_embed_styl__['default'] } : function() { return __WEBPACK_IMPORTED_MODULE_0__eager_universal_embed_styl__; };
/* harmony import */ __webpack_require__.d(__WEBPACK_IMPORTED_MODULE_0__eager_universal_embed_styl___default, 'a', __WEBPACK_IMPORTED_MODULE_0__eager_universal_embed_styl___default);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__iframe_styl__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__iframe_styl___default = __WEBPACK_IMPORTED_MODULE_1__iframe_styl__ && __WEBPACK_IMPORTED_MODULE_1__iframe_styl__.__esModule ? function() { return __WEBPACK_IMPORTED_MODULE_1__iframe_styl__['default'] } : function() { return __WEBPACK_IMPORTED_MODULE_1__iframe_styl__; };
/* harmony import */ __webpack_require__.d(__WEBPACK_IMPORTED_MODULE_1__iframe_styl___default, 'a', __WEBPACK_IMPORTED_MODULE_1__iframe_styl___default);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pages_styl__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pages_styl___default = __WEBPACK_IMPORTED_MODULE_2__pages_styl__ && __WEBPACK_IMPORTED_MODULE_2__pages_styl__.__esModule ? function() { return __WEBPACK_IMPORTED_MODULE_2__pages_styl__['default'] } : function() { return __WEBPACK_IMPORTED_MODULE_2__pages_styl__; };
/* harmony import */ __webpack_require__.d(__WEBPACK_IMPORTED_MODULE_2__pages_styl___default, 'a', __WEBPACK_IMPORTED_MODULE_2__pages_styl___default);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_autobind_decorator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_autobind_decorator___default = __WEBPACK_IMPORTED_MODULE_3_autobind_decorator__ && __WEBPACK_IMPORTED_MODULE_3_autobind_decorator__.__esModule ? function() { return __WEBPACK_IMPORTED_MODULE_3_autobind_decorator__['default'] } : function() { return __WEBPACK_IMPORTED_MODULE_3_autobind_decorator__; };
/* harmony import */ __webpack_require__.d(__WEBPACK_IMPORTED_MODULE_3_autobind_decorator___default, 'a', __WEBPACK_IMPORTED_MODULE_3_autobind_decorator___default);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_application__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__store__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lib_custom_event__ = __webpack_require__(11);

/* harmony export */ __webpack_require__.d(exports, "default", function() { return EagerUniversalEmbed; });var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class, _class2, _temp, _initialiseProps;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}










var iframe = __WEBPACK_IMPORTED_MODULE_5__store__["a" /* default */].iframe;


function unmountElement(element) {
  if (!element || !element.parentNode) return null;

  return element.parentNode.removeChild(element);
}

var EagerUniversalEmbed = (_class = (_temp = _class2 = function () {
  _createClass(EagerUniversalEmbed, null, [{
    key: "getPage",
    value: function getPage() {
      var id = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
      var pages = this.constructor.pages;


      return pages.filter(function ($) {
        return $.id === id;
      })[0];
    }
  }]);

  function EagerUniversalEmbed() {
    var spec = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, EagerUniversalEmbed);

    _initialiseProps.call(this);

    var _constructor = this.constructor;
    var iframeAttributes = _constructor.iframeAttributes;
    var stylesheet = _constructor.stylesheet;


    switch (_typeof(spec.container)) {
      case "object":
        // Element
        this.container = spec.container;
        break;

      case "string":
        // Selector
        this.container = document.querySelector(spec.container);
        break;

      default:
        this.container = document.body;
    }

    if (!this.container) throw new Error("EagerUniversalEmbed: container was not found.");

    if (spec.theme) {
      this.theme = Object.assign(this.theme, spec.theme);
    }

    this.style.innerHTML = stylesheet;
    this.container.appendChild(this.style); // TODO: perhaps always the document.head?

    Object.keys(iframeAttributes).forEach(function (key) {
      return iframe.element.setAttribute(key, iframeAttributes[key]);
    });

    this.container.appendChild(iframe.element);

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6_lib_custom_event__["a" /* default */])(iframe);

    this.appendModalStylesheet();

    var pageStyle = iframe.document.createElement("style");

    pageStyle.innerHTML = __WEBPACK_IMPORTED_MODULE_2__pages_styl___default.a;
    iframe.document.head.appendChild(pageStyle);

    var application = new __WEBPACK_IMPORTED_MODULE_4__components_application__["a" /* default */]({
      pages: this.constructor.pages,
      onClose: this.hide
    });

    application.mount(iframe.document.body);
  }

  _createClass(EagerUniversalEmbed, [{
    key: "appendModalStylesheet",
    value: function appendModalStylesheet() {
      var theme = this.theme;
      var modalStylesheet = this.constructor.modalStylesheet;

      var style = document.createElement("style");

      style.innerHTML = modalStylesheet + ("\n      body {\n        color: " + theme.textColor + ";\n      }\n\n      a, .accent-color {\n        color: " + theme.accentColor + ";\n      }\n\n      .button.primary, button.primary,\n      [data-component=\"site-type-search\"] .types .type[data-selected],\n      .accent-background-color {\n        background: " + theme.accentColor + ";\n      }\n    ");

      iframe.document.head.appendChild(style);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      unmountElement(iframe.element);
      unmountElement(this.style);
    }
  }, {
    key: "hide",
    value: function hide() {
      iframe.element.setAttribute("data-eager-universal-embed", "hidden");

      this.container.style.overflow = this.containerPreviousOverflow;
      this.containerPreviousOverflow = "";
    }
  }, {
    key: "show",
    value: function show() {
      iframe.element.setAttribute("data-eager-universal-embed", "visible");

      this.containerPreviousOverflow = this.container.style.overflow;
      this.container.style.overflow = "hidden";
    }
  }]);

  return EagerUniversalEmbed;
}(), _class2.stylesheet = __WEBPACK_IMPORTED_MODULE_0__eager_universal_embed_styl___default.a, _class2.modalStylesheet = __WEBPACK_IMPORTED_MODULE_1__iframe_styl___default.a, _class2.iframeAttributes = {
  allowTransparency: "",
  "data-eager-universal-embed": "hidden",
  frameBorder: "0",
  seamless: "seamless"
}, _class2.pages = [], _initialiseProps = function _initialiseProps() {
  this.theme = {
    accentColor: "#2d88f3",
    backgroundColor: "#ffffff",
    textColor: "#000000"
  };
  this.style = document.createElement("style");
}, _temp), (_applyDecoratedDescriptor(_class.prototype, "hide", [__WEBPACK_IMPORTED_MODULE_3_autobind_decorator___default.a], Object.getOwnPropertyDescriptor(_class.prototype, "hide"), _class.prototype)), _class);


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__application_styl__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__application_styl___default = __WEBPACK_IMPORTED_MODULE_0__application_styl__ && __WEBPACK_IMPORTED_MODULE_0__application_styl__.__esModule ? function() { return __WEBPACK_IMPORTED_MODULE_0__application_styl__['default'] } : function() { return __WEBPACK_IMPORTED_MODULE_0__application_styl__; };
/* harmony import */ __webpack_require__.d(__WEBPACK_IMPORTED_MODULE_0__application_styl___default, 'a', __WEBPACK_IMPORTED_MODULE_0__application_styl___default);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_autobind_decorator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_autobind_decorator___default = __WEBPACK_IMPORTED_MODULE_1_autobind_decorator__ && __WEBPACK_IMPORTED_MODULE_1_autobind_decorator__.__esModule ? function() { return __WEBPACK_IMPORTED_MODULE_1_autobind_decorator__['default'] } : function() { return __WEBPACK_IMPORTED_MODULE_1_autobind_decorator__; };
/* harmony import */ __webpack_require__.d(__WEBPACK_IMPORTED_MODULE_1_autobind_decorator___default, 'a', __WEBPACK_IMPORTED_MODULE_1_autobind_decorator___default);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_base_component__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__store__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_icons__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_site_type_search__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__application_pug__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__application_pug___default = __WEBPACK_IMPORTED_MODULE_6__application_pug__ && __WEBPACK_IMPORTED_MODULE_6__application_pug__.__esModule ? function() { return __WEBPACK_IMPORTED_MODULE_6__application_pug__['default'] } : function() { return __WEBPACK_IMPORTED_MODULE_6__application_pug__; };
/* harmony import */ __webpack_require__.d(__WEBPACK_IMPORTED_MODULE_6__application_pug___default, 'a', __WEBPACK_IMPORTED_MODULE_6__application_pug___default);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_lib_key_map__ = __webpack_require__(5);

/* harmony export */ __webpack_require__.d(exports, "a", function() { return Application; });var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class, _class2, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}











var Application = (_class = (_temp = _class2 = function (_BaseComponent) {
  _inherits(Application, _BaseComponent);

  function Application() {
    _classCallCheck(this, Application);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Application).apply(this, arguments));
  }

  _createClass(Application, [{
    key: "closeModal",
    value: function closeModal() {
      this.onClose();
    }
  }, {
    key: "isHome",
    value: function isHome() {
      return this.store.page === "home";
    }
  }, {
    key: "delgateKeyEvent",
    value: function delgateKeyEvent(nativeEvent) {
      var receiver = this.refs.content.querySelector("[data-event-receiver]");

      if (!receiver) return;

      var delgated = new CustomEvent("dispatched-" + nativeEvent.type, {
        detail: { nativeEvent: nativeEvent }
      });

      receiver.dispatchEvent(delgated);
    }
  }, {
    key: "handleKeyNavigation",
    value: function handleKeyNavigation(event) {
      switch (event.keyCode) {
        case __WEBPACK_IMPORTED_MODULE_7_lib_key_map__["a" /* default */].esc:
          event.preventDefault();
          this.closeModal();

          break;

        case __WEBPACK_IMPORTED_MODULE_7_lib_key_map__["a" /* default */].backspace:
          if (this.element.querySelector("input:focus")) break; // User is in a text field.

          event.preventDefault();

          if (!this.isHome()) this.navigateToHome();
          break;

        default:
          this.delgateKeyEvent(event);
      }
    }
  }, {
    key: "mount",
    value: function mount(mountPoint) {
      var _this2 = this;

      var element = this.compileTemplate();

      var iframeWindow = __WEBPACK_IMPORTED_MODULE_3__store__["a" /* default */].iframe.window;
      var _refs = this.refs;
      var doneButton = _refs.doneButton;
      var closeModalButton = _refs.closeModalButton;
      var nextPageButton = _refs.nextPageButton;
      var previousPageButton = _refs.previousPageButton;

      var headerButtons = [closeModalButton, previousPageButton];

      headerButtons.forEach(function (button) {
        var id = button.getAttribute("data-action");
        var icon = new __WEBPACK_IMPORTED_MODULE_4_components_icons__[id]();

        button.appendChild(icon.render());
      });

      iframeWindow.addEventListener("keyup", this.delgateKeyEvent);
      iframeWindow.addEventListener("keydown", this.handleKeyNavigation);
      iframeWindow.addEventListener("keypress", this.delgateKeyEvent);

      closeModalButton.addEventListener("click", this.closeModal);
      doneButton.addEventListener("click", this.closeModal);
      element.addEventListener("click", function (event) {
        if (event.target === element) _this2.closeModal();
      });

      previousPageButton.addEventListener("click", this.navigateToHome);

      nextPageButton.addEventListener("click", this.navigateToPage);

      this.navigateToHome();

      mountPoint.appendChild(this.element);
    }
  }, {
    key: "renderSiteTypeSearch",
    value: function renderSiteTypeSearch() {
      var content = this.refs.content;

      var siteTypeSearch = new __WEBPACK_IMPORTED_MODULE_5_components_site_type_search__["a" /* default */]({
        fooTypes: this.pages,
        onSelection: this.setNavigationState,
        onSubmit: this.navigateToPage
      });

      content.innerHTML = "";

      content.appendChild(siteTypeSearch.render());
    }
  }, {
    key: "navigateToHome",
    value: function navigateToHome() {
      this.store.page = "home";
      this.setNavigationState();
      this.renderSiteTypeSearch();
      this.autofocus();

      this.element.setAttribute("data-page", this.store.page);
    }
  }, {
    key: "navigateToPage",
    value: function navigateToPage() {
      var store = this.store;


      store.page = store.selectedId;
      store.selectedId = "";

      var content = this.refs.content;

      var _pages$filter = this.pages.filter(function (page) {
        return page.id === store.page;
      });

      var _pages$filter2 = _slicedToArray(_pages$filter, 1);

      var Page = _pages$filter2[0];

      var page = new Page();

      content.innerHTML = "";
      content.appendChild(page.render());

      this.setNavigationState();
      this.autofocus();

      this.element.setAttribute("data-page", store.page);
    }
  }, {
    key: "setNavigationState",
    value: function setNavigationState() {
      var nextPageButton = this.refs.nextPageButton;


      nextPageButton.disabled = !this.store.selectedId;
    }
  }]);

  return Application;
}(__WEBPACK_IMPORTED_MODULE_2_components_base_component__["a" /* default */]), _class2.template = __WEBPACK_IMPORTED_MODULE_6__application_pug___default.a, _class2.stylesheet = __WEBPACK_IMPORTED_MODULE_0__application_styl___default.a, _temp), (_applyDecoratedDescriptor(_class.prototype, "closeModal", [__WEBPACK_IMPORTED_MODULE_1_autobind_decorator___default.a], Object.getOwnPropertyDescriptor(_class.prototype, "closeModal"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "delgateKeyEvent", [__WEBPACK_IMPORTED_MODULE_1_autobind_decorator___default.a], Object.getOwnPropertyDescriptor(_class.prototype, "delgateKeyEvent"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "handleKeyNavigation", [__WEBPACK_IMPORTED_MODULE_1_autobind_decorator___default.a], Object.getOwnPropertyDescriptor(_class.prototype, "handleKeyNavigation"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "navigateToHome", [__WEBPACK_IMPORTED_MODULE_1_autobind_decorator___default.a], Object.getOwnPropertyDescriptor(_class.prototype, "navigateToHome"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "navigateToPage", [__WEBPACK_IMPORTED_MODULE_1_autobind_decorator___default.a], Object.getOwnPropertyDescriptor(_class.prototype, "navigateToPage"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setNavigationState", [__WEBPACK_IMPORTED_MODULE_1_autobind_decorator___default.a], Object.getOwnPropertyDescriptor(_class.prototype, "setNavigationState"), _class.prototype)), _class);


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__site_type_search_styl__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__site_type_search_styl___default = __WEBPACK_IMPORTED_MODULE_0__site_type_search_styl__ && __WEBPACK_IMPORTED_MODULE_0__site_type_search_styl__.__esModule ? function() { return __WEBPACK_IMPORTED_MODULE_0__site_type_search_styl__['default'] } : function() { return __WEBPACK_IMPORTED_MODULE_0__site_type_search_styl__; };
/* harmony import */ __webpack_require__.d(__WEBPACK_IMPORTED_MODULE_0__site_type_search_styl___default, 'a', __WEBPACK_IMPORTED_MODULE_0__site_type_search_styl___default);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_autobind_decorator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_autobind_decorator___default = __WEBPACK_IMPORTED_MODULE_1_autobind_decorator__ && __WEBPACK_IMPORTED_MODULE_1_autobind_decorator__.__esModule ? function() { return __WEBPACK_IMPORTED_MODULE_1_autobind_decorator__['default'] } : function() { return __WEBPACK_IMPORTED_MODULE_1_autobind_decorator__; };
/* harmony import */ __webpack_require__.d(__WEBPACK_IMPORTED_MODULE_1_autobind_decorator___default, 'a', __WEBPACK_IMPORTED_MODULE_1_autobind_decorator___default);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_base_component__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__site_type_search_pug__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__site_type_search_pug___default = __WEBPACK_IMPORTED_MODULE_3__site_type_search_pug__ && __WEBPACK_IMPORTED_MODULE_3__site_type_search_pug__.__esModule ? function() { return __WEBPACK_IMPORTED_MODULE_3__site_type_search_pug__['default'] } : function() { return __WEBPACK_IMPORTED_MODULE_3__site_type_search_pug__; };
/* harmony import */ __webpack_require__.d(__WEBPACK_IMPORTED_MODULE_3__site_type_search_pug___default, 'a', __WEBPACK_IMPORTED_MODULE_3__site_type_search_pug___default);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_icons__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lib_key_map__ = __webpack_require__(5);

/* harmony export */ __webpack_require__.d(exports, "a", function() { return SiteTypeSearch; });var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class, _class2, _temp;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}









var SearchIcon = __WEBPACK_IMPORTED_MODULE_4_components_icons__["search"];


function setVisibility(element, hidden) {
  element.style.display = hidden ? "none" : "";
}

var SiteTypeSearch = (_class = (_temp = _class2 = function (_BaseComponent) {
  _inherits(SiteTypeSearch, _BaseComponent);

  function SiteTypeSearch() {
    _classCallCheck(this, SiteTypeSearch);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(SiteTypeSearch).apply(this, arguments));
  }

  _createClass(SiteTypeSearch, [{
    key: "handleSearchInput",
    value: function handleSearchInput(_ref) {
      var value = _ref.target.value;

      this.query = value.toLowerCase();
      var typesContainer = this.refs.typesContainer;


      this.types.forEach(function (_ref2) {
        var id = _ref2.id;
        var hidden = _ref2.hidden;

        var type = typesContainer.querySelector(".type[data-id=" + id + "]");

        setVisibility(type, hidden);
      });

      var _types$filter = this.types.filter(function (_ref3) {
        var hidden = _ref3.hidden;
        return !hidden;
      });

      var _types$filter2 = _slicedToArray(_types$filter, 1);

      var firstVisible = _types$filter2[0];


      this.selectType(firstVisible.id, { focus: true });
    }
  }, {
    key: "handleDelgatedKeydown",
    value: function handleDelgatedKeydown(_ref4) {
      var _KM$up$KM$down$native;

      var nativeEvent = _ref4.detail.nativeEvent;

      var delta = (_KM$up$KM$down$native = {}, _defineProperty(_KM$up$KM$down$native, __WEBPACK_IMPORTED_MODULE_5_lib_key_map__["a" /* default */].up, -1), _defineProperty(_KM$up$KM$down$native, __WEBPACK_IMPORTED_MODULE_5_lib_key_map__["a" /* default */].down, 1), _KM$up$KM$down$native)[nativeEvent.keyCode];

      if (!delta) return;

      nativeEvent.preventDefault();

      var selectedId = this.store.selectedId;

      var types = this.types.filter(function (type) {
        return !type.hidden;
      });

      if (!types.length) return;

      var length = types.length;

      var currentIndex = types.findIndex(function (_ref5) {
        var id = _ref5.id;
        return id === selectedId;
      }) || 0;

      // Move the index by delta and wrap around the bottom/top.
      var nextIndex = (currentIndex + delta + length) % length;

      selectedId = types[nextIndex].id;

      this.selectType(selectedId, { focus: true });
    }
  }, {
    key: "handleDelgatedKeypress",
    value: function handleDelgatedKeypress(_ref6) {
      var nativeEvent = _ref6.detail.nativeEvent;

      if (nativeEvent.keyCode !== __WEBPACK_IMPORTED_MODULE_5_lib_key_map__["a" /* default */].enter || !this.store.selectedId) return;

      nativeEvent.preventDefault();

      this.onSubmit();
    }
  }, {
    key: "selectType",
    value: function selectType(selectedId) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var _refs = this.refs;
      var types = _refs.types;
      var typesContainer = _refs.typesContainer;


      this.store.selectedId = selectedId;

      types.forEach(this.setTypeStyle);

      if (options.focus) {
        typesContainer.querySelector(".type[data-id=\"" + selectedId + "\"]").scrollIntoView(true);
      }

      this.onSelection();
    }
  }, {
    key: "render",
    value: function render() {
      this.compileTemplate();

      var search = this.refs.search;

      var searchIcon = new SearchIcon();

      this.insertBefore(searchIcon.render(), search);

      search.addEventListener("input", this.handleSearchInput);

      this.renderTypes();

      this.element.addEventListener("dispatched-keydown", this.handleDelgatedKeydown);
      this.element.addEventListener("dispatched-keypress", this.handleDelgatedKeypress);

      return this.element;
    }
  }, {
    key: "renderTypes",
    value: function renderTypes() {
      var _this2 = this;

      var typesContainer = this.refs.typesContainer;


      this.types.forEach(function ($) {
        var Icon = __WEBPACK_IMPORTED_MODULE_4_components_icons__[$.id] || __WEBPACK_IMPORTED_MODULE_4_components_icons__["embed"];
        var icon = new Icon();
        var typeEl = typesContainer.appendChild(document.createElement("div"));

        typeEl.className = "type";
        typeEl.setAttribute("data-action", "");
        typeEl.setAttribute("data-ref", "types[]");
        typeEl.setAttribute("data-id", $.id);
        setVisibility(typeEl, $.hidden);

        typeEl.appendChild(icon.render());
        typeEl.appendChild(document.createTextNode($.label));
        _this2.updateRefs();

        _this2.setTypeStyle(typeEl);

        typeEl.addEventListener("click", function () {
          return _this2.selectType($.id);
        });
      });
    }
  }, {
    key: "setTypeStyle",
    value: function setTypeStyle(element) {
      if (element.getAttribute("data-id") === this.store.selectedId) {
        element.setAttribute("data-selected", "");
      } else {
        element.removeAttribute("data-selected");
      }
    }
  }, {
    key: "types",
    get: function get() {
      var query = this.query;
      var fooTypes = this.fooTypes;


      if (!query) return fooTypes;

      return fooTypes.map(function (type) {
        var label = type.label.toLowerCase();

        return _extends({}, type, {
          hidden: label.indexOf(query) === -1 && !type.fallback
        });
      });
    }
  }]);

  return SiteTypeSearch;
}(__WEBPACK_IMPORTED_MODULE_2_components_base_component__["a" /* default */]), _class2.template = __WEBPACK_IMPORTED_MODULE_3__site_type_search_pug___default.a, _class2.stylesheet = __WEBPACK_IMPORTED_MODULE_0__site_type_search_styl___default.a, _temp), (_applyDecoratedDescriptor(_class.prototype, "handleSearchInput", [__WEBPACK_IMPORTED_MODULE_1_autobind_decorator___default.a], Object.getOwnPropertyDescriptor(_class.prototype, "handleSearchInput"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "handleDelgatedKeydown", [__WEBPACK_IMPORTED_MODULE_1_autobind_decorator___default.a], Object.getOwnPropertyDescriptor(_class.prototype, "handleDelgatedKeydown"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "handleDelgatedKeypress", [__WEBPACK_IMPORTED_MODULE_1_autobind_decorator___default.a], Object.getOwnPropertyDescriptor(_class.prototype, "handleDelgatedKeypress"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setTypeStyle", [__WEBPACK_IMPORTED_MODULE_1_autobind_decorator___default.a], Object.getOwnPropertyDescriptor(_class.prototype, "setTypeStyle"), _class.prototype)), _class);


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

/* eslint-env node, es6 */

var EagerUniversalEmbed = __webpack_require__(7).default;

module.exports = EagerUniversalEmbed;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export */ exports["a"] = polyfillCustomEvent;function polyfillCustomEvent(_ref) {
  var document = _ref.document;
  var window = _ref.window;

  if (typeof window.CustomEvent === "function") return false;

  function CustomEvent(event) {
    var params = arguments.length <= 1 || arguments[1] === undefined ? { bubbles: false, cancelable: false } : arguments[1];

    var shimEvent = document.createEvent("CustomEvent");

    shimEvent.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

    return shimEvent;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "[data-component=\"application\"] {\n  -webkit-box-align: center;\n  -o-box-align: center;\n  -ms-flex-align: center;\n  -ms-grid-row-align: center;\n      align-items: center;\n  -webkit-box-pack: center;\n  -o-box-pack: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  max-height: 100%;\n  min-height: 100%;\n}\n[data-component=\"application\"][data-page=\"home\"] .modal-footer [data-action=\"close\"] {\n  display: none;\n}\n[data-component=\"application\"][data-page=\"home\"] .modal-header [data-action=\"previous\"] {\n  visibility: hidden;\n}\n[data-component=\"application\"]:not([data-page=\"home\"]) .modal-footer [data-action=\"next\"] {\n  display: none;\n}\n@media (max-height: 24em) {\n  [data-component=\"application\"] {\n    -webkit-box-pack: start;\n    -o-box-pack: start;\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n  }\n}\n[data-component=\"application\"] .modal {\n  position: relative;\n  z-index: 1;\n  -webkit-box-flex: 1;\n  -o-box-flex: 1;\n  box-flex: 1;\n  -ms-flex: 1 1 auto;\n  flex: 1 1 auto;\n  min-height: 18em;\n  max-height: 38em;\n  overflow: hidden;\n  width: 35em;\n  max-width: 100%;\n  background: #fff;\n  border-radius: 0.3125em;\n}\n[data-component=\"application\"] .modal .content {\n  -webkit-box-flex: 1;\n  -o-box-flex: 1;\n  box-flex: 1;\n  -ms-flex: 1 1 auto;\n  flex: 1 1 auto;\n}\n[data-component=\"application\"] .modal .content > [data-component] {\n  width: 100%;\n}\n[data-component=\"application\"] .modal-header {\n  -webkit-box-align: center;\n  -o-box-align: center;\n  -ms-flex-align: center;\n  -ms-grid-row-align: center;\n      align-items: center;\n  box-shadow: 0 1px rgba(0,0,0,0.21);\n  -webkit-box-flex: 1;\n  -o-box-flex: 1;\n  box-flex: 1;\n  -ms-flex: 0 0 auto;\n  flex: 0 0 auto;\n  -webkit-box-pack: justify;\n  -o-box-pack: justify;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n  width: 100%;\n}\n[data-component=\"application\"] .modal-header .title {\n  text-align: center;\n  line-height: 1.4;\n  padding: 0.8em 0;\n}\n[data-component=\"application\"] .modal-header button[data-action] {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  background: inherit;\n  border-radius: 0;\n  color: inherit;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: box;\n  display: flex;\n  height: 4em;\n  -webkit-box-pack: center;\n  -o-box-pack: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  opacity: 0.85;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=85)\";\n  filter: alpha(opacity=85);\n  width: 4em;\n}\n[data-component=\"application\"] .modal-header button[data-action]:hover {\n  background: #f3f3f3;\n  box-shadow: none;\n  opacity: 1;\n  -ms-filter: none;\n  -webkit-filter: none;\n          filter: none;\n}\n[data-component=\"application\"] .modal-header button[data-action]:not(:hover) {\n  color: #888;\n}\n[data-component=\"application\"] .modal-header button[data-action] > .icon {\n  -webkit-box-flex: 1;\n  -o-box-flex: 1;\n  box-flex: 1;\n  -ms-flex: 1 0 auto;\n  flex: 1 0 auto;\n  width: 1em;\n  height: 1em;\n  stroke: currentColor;\n}\n[data-component=\"application\"] .modal-footer {\n  box-shadow: 0 -1px rgba(0,0,0,0.21);\n  -webkit-box-flex: 1;\n  -o-box-flex: 1;\n  box-flex: 1;\n  -ms-flex: 0 0 auto;\n  flex: 0 0 auto;\n  -webkit-box-pack: end;\n  -o-box-pack: end;\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n  padding: 1.5em;\n}\n[data-component=\"application\"] .modal-footer button[disabled],\n[data-component=\"application\"] .modal-footer .button[disabled] {\n  background: #e0e0e0;\n}\n@media (min-width: 769px) {\n  [data-component=\"application\"] .modal {\n    margin: 1.5em 0;\n  }\n}\n@media (max-width: 768px) {\n  [data-component=\"application\"] .modal {\n    border-radius: 0;\n    max-height: 100vh;\n    width: 100%;\n  }\n}\n", ""]);

// exports


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "[data-component=\"site-type-search\"] .header {\n  -webkit-box-align: center;\n  -o-box-align: center;\n  -ms-flex-align: center;\n  -ms-grid-row-align: center;\n      align-items: center;\n  box-shadow: 0 1px rgba(0,0,0,0.21);\n  -webkit-box-flex: 1;\n  -o-box-flex: 1;\n  box-flex: 1;\n  -ms-flex: 0 0 auto;\n  flex: 0 0 auto;\n  width: 100%;\n  z-index: 2;\n}\n[data-component=\"site-type-search\"] .header .icon {\n  stroke: #888;\n  width: 1em;\n  margin-left: 1.5em;\n}\n[data-component=\"site-type-search\"] .header .search {\n  background: transparent;\n  border: none;\n  -webkit-box-flex: 1;\n  -o-box-flex: 1;\n  box-flex: 1;\n  -ms-flex: 1 0 auto;\n  flex: 1 0 auto;\n  padding: 1.5em;\n}\n[data-component=\"site-type-search\"] .header .search:focus {\n  outline: none;\n}\n[data-component=\"site-type-search\"] .types {\n  overflow-y: scroll;\n  z-index: 1;\n}\n[data-component=\"site-type-search\"] .types .type {\n  position: relative;\n  cursor: pointer;\n  -webkit-box-align: center;\n  -o-box-align: center;\n  -ms-flex-align: center;\n  -ms-grid-row-align: center;\n      align-items: center;\n  -webkit-box-flex: 1;\n  -o-box-flex: 1;\n  box-flex: 1;\n  -ms-flex: 0 0 auto;\n  flex: 0 0 auto;\n  padding: 1em;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n[data-component=\"site-type-search\"] .types .type:not(:first-child) {\n  margin-top: -1px;\n}\n[data-component=\"site-type-search\"] .types .type:not(:last-child):not(:hover) {\n  box-shadow: inset 0 -1px #e0e0e0;\n}\n[data-component=\"site-type-search\"] .types .type:not([data-selected]) {\n  z-index: 1;\n  background: transparent;\n  color: inherit;\n}\n[data-component=\"site-type-search\"] .types .type:not([data-selected]):hover {\n  z-index: 1;\n  box-shadow: none;\n  background: #f3f3f3;\n}\n[data-component=\"site-type-search\"] .types .type:not([data-selected]):first-child:hover {\n  box-shadow: inset 0 -1px rgba(0,0,0,0.125);\n}\n[data-component=\"site-type-search\"] .types .type:not([data-selected]):last-child:hover {\n  box-shadow: inset 0 1px rgba(0,0,0,0.125);\n}\n[data-component=\"site-type-search\"] .types .type:not([data-selected]):not(:first-child):not(:last-child):hover {\n  box-shadow: inset 0 -1px rgba(0,0,0,0.125), inset 0 1px rgba(0,0,0,0.125);\n}\n[data-component=\"site-type-search\"] .types .type[data-selected],\n[data-component=\"site-type-search\"] .types .type[data-selected]:hover {\n  z-index: 2;\n  color: #fff;\n  box-shadow: none !important;\n}\n[data-component=\"site-type-search\"] .types .type .icon {\n  fill: currentColor;\n  height: 2em;\n  margin-right: 1em;\n  width: 2em;\n}\n", ""]);

// exports


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "[data-eager-universal-embed] {\n  bottom: 0 !important;\n  display: none !important;\n  height: 100vh !important;\n  left: 0 !important;\n  position: fixed !important;\n  right: 0 !important;\n  top: 0 !important;\n  width: 100vw !important;\n}\n[data-eager-universal-embed=\"visible\"] {\n  display: block !important;\n}\n", ""]);

// exports


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "article,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nnav,\nsection,\nsummary {\n  display: block;\n}\naudio,\ncanvas,\nvideo {\n  display: inline;\n  zoom: 1;\n}\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n[hidden] {\n  display: none;\n}\nhtml {\n  font-size: 100%;\n  -webkit-text-size-adjust: 100%;\n  -ms-text-size-adjust: 100%;\n  text-size-adjust: 100%;\n}\nbody {\n  margin: 0;\n  text-rendering: optimizeLegibility;\n}\nbutton,\ninput,\nselect,\ntextarea {\n  font-family: inherit;\n  font-size: inherit;\n  margin: 0;\n}\nbutton,\ninput {\n  line-height: normal;\n}\nbutton,\ninput[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  cursor: pointer;\n}\nbutton[disabled],\ninput[type=\"button\"][disabled],\ninput[type=\"reset\"][disabled],\ninput[type=\"submit\"][disabled] {\n  cursor: not-allowed;\n}\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0;\n}\na:focus {\n  outline: thin dotted;\n}\na:active,\na:hover {\n  outline: 0;\n}\nabbr[title] {\n  border-bottom: thin dotted;\n}\nb,\nstrong {\n  font-weight: 700;\n}\ndfn {\n  font-style: italic;\n}\npre {\n  white-space: pre-wrap;\n  word-wrap: break-word;\n}\nimg {\n  border: 0;\n  -ms-interpolation-mode: bicubic;\n}\nsvg:not(:root) {\n  overflow: hidden;\n}\ntextarea {\n  overflow: auto;\n  vertical-align: top;\n  resize: vertical;\n}\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\nfigure,\nform {\n  margin: 0;\n}\np,\npre,\ndl,\nmenu,\nol,\nul {\n  margin: 1em 0;\n}\n*,\n*:after,\n*:before {\n  box-sizing: border-box;\n}\nhtml {\n  font-size: 16px;\n}\nbody {\n  font-family: \"Avenir New\", Avenir, \"Helvetica Neue\", sans-serif;\n}\nbutton,\n.button {\n  -webkit-font-smoothing: subpixel-antialiased;\n  -moz-osx-font-smoothing: auto;\n  position: relative;\n  text-rendering: optimizeLegibility;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  display: inline-block;\n  cursor: pointer;\n  border: 0;\n  border-radius: 0.1875em;\n  font-size: 1em;\n  padding: 0.6em 2em;\n  margin: 0;\n  text-align: center;\n  font-family: \"Avenir New\", Avenir, \"Helvetica Neue\", sans-serif;\n  font-weight: 300;\n  letter-spacing: 0.04em;\n  text-indent: 0.04em;\n  text-decoration: none;\n}\nbutton.slim,\n.button.slim {\n  padding-left: 1em;\n  padding-right: 1em;\n}\nbutton.nowrap,\n.button.nowrap {\n  white-space: nowrap;\n  max-width: 100%;\n}\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n  button,\n  .button {\n    font-weight: 400;\n  }\n}\n@media all and (-webkit-min-device-pixel-ratio: 0) and (-webkit-min-device-pixel-ratio: 0.001), all and (-webkit-min-device-pixel-ratio: 0) and (min-resolution: 0.001dppx) {\n  button,\n  .button {\n    font-weight: 300;\n  }\n}\nbutton:hover,\n.button:hover {\n  text-decoration: none;\n}\nbutton[disabled],\n.button[disabled] {\n  opacity: 0.7;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=70)\";\n  filter: alpha(opacity=70);\n}\nbutton[disabled]:hover,\n.button[disabled]:hover,\nbutton[disabled]:focus,\n.button[disabled]:focus,\nbutton[disabled]:focus:hover,\n.button[disabled]:focus:hover {\n  box-shadow: none !important;\n}\nbutton:hover,\n.button:hover {\n  box-shadow: 0 0.1875em 0.375em -0.1875em rgba(0,0,0,0.325);\n}\nbutton:hover:active,\n.button:hover:active,\nbutton.active,\n.button.active {\n  box-shadow: inset 0 0.125em 0.375em rgba(0,0,0,0.325);\n}\nbutton:focus,\n.button:focus {\n  outline: none;\n}\nbutton:focus:before,\n.button:focus:before {\n  content: \"\";\n  position: absolute;\n  z-index: 1;\n  top: 2px;\n  right: 2px;\n  bottom: 2px;\n  left: 2px;\n  border-radius: 0.1em;\n  box-shadow: inset 0 0 0 1px #fff;\n  pointer-events: none;\n  -webkit-transition: opacity 0.3s ease-in-out;\n  transition: opacity 0.3s ease-in-out;\n}\nbutton:focus:active:before,\n.button:focus:active:before {\n  opacity: 0;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\";\n  filter: alpha(opacity=0);\n}\nbutton.primary,\n.button.primary {\n  background: #000;\n  color: #fff;\n}\nbutton.transparent,\n.button.transparent {\n  font-weight: 400;\n}\nbutton.transparent:not(:hover):not(:active):not(.active):not(:focus),\n.button.transparent:not(:hover):not(:active):not(.active):not(:focus) {\n  background: transparent;\n  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.21);\n  color: rgba(0,0,0,0.55);\n}\nbutton.small,\n.button.small {\n  font-size: 0.9em;\n  border-radius: 0.2083em;\n  letter-spacing: 0.06em;\n  text-indent: 0.06em;\n}\nbutton.large,\n.button.large {\n  font-size: 1.25em;\n}\nbutton.with-spinner-icon,\n.button.with-spinner-icon {\n  position: relative;\n}\nbutton.with-spinner-icon .icon.spinner-icon,\n.button.with-spinner-icon .icon.spinner-icon {\n  display: none;\n}\nbutton.with-spinner-icon.showing-spinner-icon .button-content,\n.button.with-spinner-icon.showing-spinner-icon .button-content {\n  opacity: 0;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\";\n  filter: alpha(opacity=0);\n  pointer-events: none;\n}\nbutton.with-spinner-icon.showing-spinner-icon .icon.spinner-icon,\n.button.with-spinner-icon.showing-spinner-icon .icon.spinner-icon {\n  position: absolute;\n  display: block;\n  margin: auto;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n}\nbutton.with-spinner-icon.showing-spinner-icon.more:after,\n.button.with-spinner-icon.showing-spinner-icon.more:after {\n  opacity: 0;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\";\n  filter: alpha(opacity=0);\n  pointer-events: none;\n}\n.buttons-group span.buttons-group-message {\n  display: inline-block;\n  padding: 0.6em 0;\n}\n.buttons-group span.buttons-group-message.small {\n  font-size: 0.9em;\n}\n.buttons-group span.buttons-group-message.large {\n  font-size: 1.25em;\n}\n@media (min-width: 569px) {\n  .buttons-group button,\n  .buttons-group .button,\n  .buttons-group span.buttons-group-message {\n    margin-right: 1em;\n  }\n  .buttons-group button:last-child,\n  .buttons-group .button:last-child,\n  .buttons-group span.buttons-group-message:last-child {\n    margin-right: 0;\n  }\n}\n@media (max-width: 568px) {\n  .buttons-group button,\n  .buttons-group .button,\n  .buttons-group span.buttons-group-message {\n    display: block;\n    margin-bottom: 1em;\n  }\n  .buttons-group button:last-child,\n  .buttons-group .button:last-child,\n  .buttons-group span.buttons-group-message:last-child {\n    margin-bottom: 0;\n  }\n}\n@media (max-width: 568px) {\n  .buttons-group button {\n    width: 100%;\n  }\n}\n.modal-scroller {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n  overflow-scrolling: touch;\n}\n.modal .modal-body-page.hidden {\n  display: none;\n}\n.modal .modal-content-padded {\n  padding: 1.5em;\n}\n.modal .modal-header {\n  position: relative;\n  z-index: 10;\n  box-shadow: 0 1px rgba(0,0,0,0.21);\n}\n.modal .modal-top-stripe {\n  position: relative;\n  height: 4em;\n  padding: 1.5em 5.5em;\n}\n.modal .modal-top-stripe .text {\n  line-height: 1.4;\n  position: relative;\n  top: -0.0625em;\n  font-weight: 500;\n  color: #404040;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  text-align: center;\n  letter-spacing: 0.01em;\n}\n.modal .modal-top-stripe .back,\n.modal .modal-top-stripe .close {\n  top: 0;\n  position: absolute;\n  cursor: pointer;\n  display: block;\n  color: inherit;\n  height: 4em;\n  width: 4em;\n}\n.modal .modal-top-stripe .back:hover,\n.modal .modal-top-stripe .close:hover {\n  background: #f3f3f3;\n}\n.modal .modal-top-stripe .back:not(:hover),\n.modal .modal-top-stripe .close:not(:hover) {\n  color: #888;\n}\n.modal .modal-top-stripe .back .icon,\n.modal .modal-top-stripe .close .icon {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  margin: auto;\n}\n.modal .modal-top-stripe .back {\n  left: 0;\n  border-radius: 0.3125em 0 0 0;\n  -webkit-transition: opacity 0.2s;\n  transition: opacity 0.2s;\n}\n.modal .modal-top-stripe .back.hidden {\n  opacity: 0;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\";\n  filter: alpha(opacity=0);\n}\n.modal .modal-top-stripe .back .icon {\n  height: 12px;\n  width: 12px;\n  border-left: 1px solid currentColor;\n  border-bottom: 1px solid currentColor;\n  -webkit-transform: rotate(45deg);\n  transform: rotate(45deg);\n}\n.modal .modal-top-stripe .close {\n  right: 0;\n  border-radius: 0 0.3125em 0 0;\n}\n.modal .modal-top-stripe .close .icon {\n  height: 21px;\n  width: 21px;\n  -webkit-transform: rotate(45deg);\n  transform: rotate(45deg);\n}\n.modal .modal-top-stripe .close .icon:before,\n.modal .modal-top-stripe .close .icon:after {\n  content: \"\";\n  display: block;\n  position: absolute;\n  height: 100%;\n  width: 100%;\n}\n.modal .modal-top-stripe .close .icon:before {\n  left: 10px;\n  border-left: 1px solid currentColor;\n}\n.modal .modal-top-stripe .close .icon:after {\n  top: 10px;\n  border-top: 1px solid currentColor;\n}\n.modal .modal-footer {\n  position: relative;\n  z-index: 10;\n  box-shadow: 0 -1px rgba(0,0,0,0.21);\n}\n.modal .modal-body {\n  position: relative;\n  z-index: 5;\n  min-height: 10em;\n  max-height: calc(100vh - 14em);\n  overflow: scroll;\n}\n.modal .modal-text-stripe {\n  position: relative;\n  padding: 1.5em;\n}\n.modal .modal-text-stripe .text {\n  line-height: 1.3;\n  position: relative;\n  top: 0.125em;\n  font-weight: 300;\n  color: #888;\n  letter-spacing: 0.01em;\n}\n@media (min-width: 769px) {\n  .modal-scroller {\n    padding: 1.5em 0;\n  }\n  .modal-vertical-align-outer {\n    display: table;\n    margin: 0 auto;\n    height: 100%;\n  }\n  .modal-vertical-align-inner {\n    display: table-cell;\n    vertical-align: middle;\n  }\n}\n@media (max-width: 768px) {\n  .modal-scroller {\n    position: static;\n  }\n  .modal {\n    width: 100%;\n    border-radius: 0;\n  }\n  .modal .modal-top-stripe .back,\n  .modal .modal-top-stripe .close {\n    border-radius: 0;\n  }\n}\n\n@font-face {\n  font-family: \"universal-embed-icons\";\n  font-style: normal;\n  font-weight: normal;\n  src: url(data:application/x-font-woff;charset=utf-8;base64,d09GRk9UVE8AAAQQAAoAAAAABewAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABDRkYgAAAA9AAAARQAAAEw7LPuDUZGVE0AAAIIAAAAGgAAABx04jsnT1MvMgAAAiQAAABLAAAAYGFpBYRjbWFwAAACcAAAAEcAAAFOP7UHcGhlYWQAAAK4AAAALwAAADYGoUQqaGhlYQAAAugAAAAfAAAAJAe/AetobXR4AAADCAAAABAAAAAQCwoAAG1heHAAAAMYAAAABgAAAAYABFAAbmFtZQAAAyAAAADaAAABsE3GDFBwb3N0AAAD/AAAABMAAAAg/50AZnicTY69S8NQFMXvbV5aLI/4GXEIzSJYAh0dXPwXLNpgVymvH6AtpMHJsWglk06CuPXvEPyg9E9wt2SVt/huk2exWUo5HPgdONx7EBgDROTioiWCSqfR6/YBc4BwTKUcuQbtsTo3JGelIrBh2Y2iJfBCFM5GydB04GXdAdhwYLTpwJqDB1tgZjfysA0ueHAYdq5EP+i02mGl0RbXQa97KZpLXvm9OgMA73CI98AQ90+aN+onkgmXKCVpacjd2ST5+pvk5TywE056zgsW+XRrq281rX2m0zROYxXXTtU0zRS/n6lFVhl9mBY90sDW5/RUrZOnhV547JvWLw0Y+fp5/KbLJMgjUX1dlB92Zkd2xIv/gw+CN3icY2BgYGQAggsF9tdA9CWLvytgNABOBQe1AAB4nGNgZopgnMDAysDBasw6k4GBUQ5CM19nSGMSYgACVgYIaGBgYGJAAgFprikMDgzXFazY0v6lMexg/sIgDhRmhCtQAEJGABgTC0oAeJxjYGBgZoBgGQZGBhDwAPIYwXwWBh0gzQakGRmYGK4rWP3/D+RfV7D8//+/FpAFUsUC1s0E5LAxQA0YnoCZibAaAF3eCGYAeJxjYGRgYADisx3H/eL5bb4ycHMwgMAli78rEPT/l8wCzF+AXA4GJpAoAFzJDHkAeJxjYGRgYP7y/yXDDmYBBoZ/b4EkUAQFsAAAloYFrwAEAAAAAf0AAAH9AAADEAAAAABQAAAEAAB4nI2PvQ3CMBCFXyCJxI8oEaULJCpHTiRSMEBKSvoIWVGaWHKYgREYgzEYgDEYgJoXc0UKCizZ/u7euzsbwBI3RBhWhAU2whMkMMJT7HAVjul5CCfkl3CKRbSiM4pnzKxD1cATzLEVnuKIUjim5y6ckJ/CKfkNixoNTw+NFmc4dOgBWzfW6/bsOgajvGSqEF/C7UO9QoGM/1A4cP/u+tVK5nI6NSsMac92rrtUzjdWFZlRBzWazqjUudGFyWn857WnoPfUB1VxwvAunKzvW9epPDN/9fkAFF9DNgAAeJxjYGYAg/+zGNIYsAAALpkCAwA=) format(\"woff\");\n}\na.more:after,\nbutton.more:after,\n.with-more-icon-after:after {\n  font-family: \"universal-embed-icons\";\n  position: relative;\n  display: inline-block;\n  vertical-align: baseline;\n  color: inherit;\n  font-style: normal;\n  font-weight: inherit;\n  font-size: 1em;\n  line-height: 1;\n  text-decoration: none;\n  content: \"\\203A\";\n  padding-left: 0.3em;\n}\na.before:before,\n.with-before-icon-before:before {\n  font-family: \"universal-embed-icons\";\n  position: relative;\n  display: inline-block;\n  vertical-align: baseline;\n  color: inherit;\n  font-style: normal;\n  font-weight: inherit;\n  font-size: 1em;\n  line-height: 1;\n  text-decoration: none;\n  content: \"\\2039\";\n  padding-right: 0.3em;\n}\n.plugin-choice-list {\n  box-shadow: inset 0 1px #e0e0e0;\n}\n.plugin-choice-list,\n.plugin-choice-list li {\n  display: block;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.plugin-choice-list li:not(:first-child) .plugin-choice {\n  margin-top: -1px;\n}\n.plugin-choice-list li:not(:last-child):not(:hover) .plugin-choice {\n  box-shadow: inset 0 -1px #e0e0e0;\n}\n.plugin-choice-list li:not(:last-child):not(:hover) .plugin-choice.selected {\n  box-shadow: none;\n}\n.plugin-choice-list .plugin-choice {\n  position: relative;\n  cursor: pointer;\n  display: block;\n  padding: 1em;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.plugin-choice-list .plugin-choice:not(.selected) {\n  background: transparent;\n  color: inherit;\n}\n.plugin-choice-list .plugin-choice:not(.selected):hover {\n  z-index: 1;\n  box-shadow: none;\n  background: #f3f3f3;\n  box-shadow: inset 0 -1px rgba(0,0,0,0.125), inset 0 1px rgba(0,0,0,0.125);\n}\n.plugin-choice-list .plugin-choice.selected,\n.plugin-choice-list .plugin-choice.selected:hover {\n  z-index: 2;\n  color: #fff;\n  box-shadow: none;\n}\n.plugin-choice-list .plugin-choice > span,\n.plugin-choice-list .plugin-choice > .icon {\n  display: inline-block;\n  vertical-align: middle;\n  height: 2em;\n  line-height: 2em;\n}\n.plugin-choice-list .plugin-choice > span {\n  padding-left: 1em;\n  padding-right: 1em;\n}\n.plugin-choice-list .plugin-choice > .icon {\n  position: relative;\n  width: 2em;\n}\n.plugin-choice-list .plugin-choice > .icon > svg {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  fill: currentColor;\n  display: inline-block;\n  height: 75%;\n  width: 75%;\n}\nhtml,\nbody,\nmain {\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\nhtml {\n  background: transparent;\n}\nbody {\n  background: rgba(0,0,0,0.4);\n  cursor: default;\n  margin: 0;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\ndiv,\nfooter,\nheader,\nmain,\nsection {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: box;\n  display: flex;\n}\n[data-column] {\n  -webkit-box-orient: vertical;\n  -moz-box-orient: vertical;\n  -o-box-orient: vertical;\n  -webkit-box-lines: single;\n  -moz-box-lines: single;\n  -o-box-lines: single;\n  -ms-flex-flow: column nowrap;\n  flex-flow: column nowrap;\n}\n[data-action] {\n  cursor: pointer;\n}\n[data-visibility=\"hidden\"] {\n  visibility: hidden;\n}\n[data-selectable],\n[contenteditable] {\n  cursor: text;\n  -webkit-user-select: text;\n  -moz-user-select: text;\n  -ms-user-select: text;\n  user-select: text;\n}\n", ""]);

// exports


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "[data-component$=\"-page\"] {\n  overflow: scroll;\n}\n.instructions.markdown {\n  cursor: auto;\n  display: block;\n  padding: 3em 2em 3em 4em;\n  -webkit-user-select: text;\n  -moz-user-select: text;\n  -ms-user-select: text;\n  user-select: text;\n}\n.instructions.markdown figure > img {\n  max-width: 100%;\n}\n.instructions.markdown h1 {\n  font-size: 1.25em;\n  font-weight: 300;\n  margin-top: 2em;\n  margin-bottom: 2em;\n  text-align: center;\n  padding-right: 2em;\n}\n.instructions.markdown h2 {\n  font-size: 1em;\n  font-weight: 500;\n  margin-top: 3em;\n}\n.instructions.markdown h2 .step-number {\n  display: inline-block;\n  width: 2em;\n  height: 2em;\n  margin-right: 1em;\n  margin-left: -3em;\n  line-height: 2em;\n  text-align: center;\n  vertical-align: baseline;\n  border-radius: 999em;\n}\n.instructions.markdown h2 .step-number:not(.accent-background-color) {\n  background: rgba(0,0,0,0.045);\n}\n.instructions.markdown h2 .step-number.accent-background-color {\n  color: #fff;\n}\n.instructions.markdown p {\n  color: #888;\n}\n.instructions.markdown > *:first-child {\n  margin-top: 0;\n}\n.instructions.markdown > *:last-child {\n  margin-bottom: 0;\n}\n", ""]);

// exports


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

// css-to-string-loader: transforms styles from css-loader to a string output

// Get the styles
var styles = __webpack_require__(12);

if (typeof styles === 'string') {
  // Return an existing string
  module.exports = styles;
} else {
  // Call the custom toString method from css-loader module
  module.exports = styles.toString();
}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

// css-to-string-loader: transforms styles from css-loader to a string output

// Get the styles
var styles = __webpack_require__(13);

if (typeof styles === 'string') {
  // Return an existing string
  module.exports = styles;
} else {
  // Call the custom toString method from css-loader module
  module.exports = styles.toString();
}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

// css-to-string-loader: transforms styles from css-loader to a string output

// Get the styles
var styles = __webpack_require__(14);

if (typeof styles === 'string') {
  // Return an existing string
  module.exports = styles;
} else {
  // Call the custom toString method from css-loader module
  module.exports = styles.toString();
}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

// css-to-string-loader: transforms styles from css-loader to a string output

// Get the styles
var styles = __webpack_require__(15);

if (typeof styles === 'string') {
  // Return an existing string
  module.exports = styles;
} else {
  // Call the custom toString method from css-loader module
  module.exports = styles.toString();
}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

// css-to-string-loader: transforms styles from css-loader to a string output

// Get the styles
var styles = __webpack_require__(16);

if (typeof styles === 'string') {
  // Return an existing string
  module.exports = styles;
} else {
  // Call the custom toString method from css-loader module
  module.exports = styles.toString();
}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

var jade = __webpack_require__(6);

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (config) {
buf.push("<main data-column data-component=\"application\" role=\"main\"><div data-column class=\"modal\"><header role=\"menubar\" class=\"modal-header\"><button role=\"menuitem\" data-action=\"previous\" data-ref=\"previousPageButton\"></button><span class=\"title\">" + (jade.escape((jade_interp = config.labels.title(config.appName)) == null ? '' : jade_interp)) + "</span><button role=\"menuitem\" data-action=\"close\" data-ref=\"closeModalButton\"></button></header><div data-ref=\"content\" class=\"content\"></div><footer class=\"modal-footer\"><button data-action=\"next\" data-ref=\"nextPageButton\" class=\"primary slim more\">" + (jade.escape((jade_interp = config.labels.next) == null ? '' : jade_interp)) + "</button><button data-action=\"close\" data-ref=\"doneButton\" class=\"primary slim\">" + (jade.escape((jade_interp = config.labels.done) == null ? '' : jade_interp)) + "</button></footer></div></main>");}.call(this,"config" in locals_for_with?locals_for_with.config:typeof config!=="undefined"?config:undefined));;return buf.join("");
}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

var jade = __webpack_require__(6);

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (config) {
buf.push("<section data-column data-component=\"site-type-search\" data-event-receiver><header class=\"header\"><input autofocus data-ref=\"search\"" + (jade.attr("placeholder", config.labels.searchPlaceholder, true, true)) + " type=\"text\" class=\"search\"></header><div data-column data-ref=\"typesContainer\" class=\"types\"></div></section>");}.call(this,"config" in locals_for_with?locals_for_with.config:typeof config!=="undefined"?config:undefined));;return buf.join("");
}

/***/ },
/* 24 */
/***/ function(module, exports) {

module.exports = "<svg viewBox=\"0 0 16 16\" version=\"1.1\" stroke-width=\"1\" stroke-linecap=\"square\"><path d=\"M0,0 L16,16\"></path><path d=\"M0,16 L16,0\"></path></svg>"

/***/ },
/* 25 */
/***/ function(module, exports) {

module.exports = "<svg viewBox=\"50 50 400 425\" version=\"1.1\"><path d=\"M345.703,126.605c-21.036-13.098-40.882-18.258-60.729-31.356c-12.304-8.335-29.371-28.181-43.66-45.249 c-2.779,27.387-11.114,38.501-20.64,46.439c-20.243,15.876-32.944,20.64-50.408,30.166C155.58,134.146,75.8,181.776,75.8,284.18 C75.8,386.586,161.931,462,257.588,462S436.2,392.539,436.2,287.356C436.2,182.173,358.405,134.543,345.703,126.605z M347.996,424.645c-1.984,1.985-20.242,14.687-41.676,16.671s-50.409,3.175-67.873-12.701c-2.778-2.778-1.984-6.748,0-8.336 c1.984-1.587,3.572-2.778,5.954-2.778c2.381,0,1.984,0,3.175,0.794c7.938,6.351,19.846,11.511,45.249,11.511 c25.402,0,43.264-7.145,51.202-13.098c3.572-2.779,5.16-0.397,5.557,1.19C349.982,419.486,350.775,421.867,347.996,424.645z M278.536,388.526c4.366-3.969,11.511-10.32,18.258-13.099c6.748-2.778,10.32-2.381,16.671-2.381s13.098,0.396,17.861,3.572 c4.763,3.175,7.541,10.319,9.129,14.289c1.588,3.969,0,6.351-3.176,7.938c-2.778,1.587-3.175,0.793-5.953-4.366 c-2.778-5.16-5.16-10.32-19.053-10.32c-13.892,0-18.258,4.763-25.005,10.32c-6.748,5.557-9.13,7.541-11.511,4.366 C273.376,395.671,274.17,392.495,278.536,388.526z M383.719,391.702c-14.289-1.191-42.867-45.646-61.125-46.439 c-23.021-0.794-73.033,48.026-112.328,48.026c-23.815,0-30.959-3.572-38.898-8.731c-11.907-8.336-17.861-21.037-17.464-38.501 c0.397-30.96,29.372-59.935,65.888-60.332c46.439-0.396,78.59,46.043,102.008,45.646c19.846-0.396,57.95-39.295,76.605-39.295 c19.846,0,25.402,20.64,25.402,32.944s-3.969,34.532-13.495,48.424C400.786,387.336,394.833,392.495,383.719,391.702z\"></path></svg>"

/***/ },
/* 26 */
/***/ function(module, exports) {

module.exports = "<svg viewBox=\"0 0 117 108\" version=\"1.1\"><path d=\"M75,33.3846154 L95.3478261,52 L75,69.7692308 L75,85 L114,52 L77.3198276,20.962931 L75,33.3846154 Z\"></path><path d=\"M44,105 L58,90 L74,2.5 L60,18.5 L44,103.5 Z\"></path><path d=\"M42,19 L42,33.0667892 L21.6521739,52 L43,70.7692308 L40.2767241,83.6956897 L3,52 L42,19 Z\"></path></svg>"

/***/ },
/* 27 */
/***/ function(module, exports) {

module.exports = "<svg viewBox=\"0 0 430 422\" version=\"1.1\"><path d=\"M308.584,49.669 C312.281,22 336.007,0.681 364.699,0.681 C396.002,0.681 421.398,26.055 421.398,57.369 C421.398,84.515 402.259,107.177 376.762,112.696 C380.817,123.499 382.957,134.784 382.906,146.068 C382.803,168.156 374.509,188.523 359.487,203.382 L354.09,208.738 L310.713,165.874 C314.43,162.178 316.571,160.037 316.571,160.037 C320.933,155.715 321.896,149.941 321.896,145.824 C321.958,136.546 317.574,126.829 309.956,119.159 C297.074,106.206 278.396,103.01 269.119,112.226 C269.119,112.226 216.444,164.481 172.494,208.072 L129.087,165.187 C173.119,121.483 226.182,68.9 226.182,68.9 C247.676,47.55 279.082,41.405 308.583,49.67 L308.584,49.669 Z M65.27,0.681 C94.003,0.681 117.668,22 121.385,49.669 C150.876,41.406 182.303,47.549 203.817,68.91 C203.817,68.91 205.824,70.927 209.377,74.399 L165.806,117.131 C162.622,113.977 160.86,112.226 160.86,112.226 C151.582,103.01 132.884,106.205 120.013,119.159 C112.425,126.829 108.032,136.546 108.053,145.824 C108.083,149.93 109.067,155.716 113.439,160.037 C113.439,160.037 167.301,213.5 211.016,256.846 L167.466,299.577 L70.473,203.372 C55.461,188.524 47.197,168.157 47.054,146.058 C47.023,134.773 49.153,123.489 53.168,112.686 C27.701,107.167 8.593,84.506 8.593,57.359 C8.603,26.045 33.978,0.681 65.271,0.681 L65.27,0.681 Z M146.904,380.144 C135.528,380.093 124.141,377.81 113.368,373.652 C109.067,400.655 85.679,421.309 57.427,421.309 C26.134,421.309 0.749,395.944 0.749,364.641 C0.749,335.18 23.247,310.973 51.97,308.229 C49.082,299.064 47.577,289.551 47.638,280.049 C47.72,258.003 56.024,237.604 71.006,222.777 C71.006,222.777 72.686,221.097 75.614,218.179 L118.806,261.249 C115.724,264.352 113.952,266.072 113.952,266.072 C109.59,270.434 108.637,276.209 108.637,280.296 C108.617,289.614 112.938,299.301 120.577,306.971 C128.185,314.671 137.873,319.095 147.13,319.136 C151.256,319.136 157.094,318.256 161.425,313.903 C161.425,313.903 214.161,261.587 258.132,217.985 L301.334,261.055 L204.351,357.219 C189.4,372.067 169.013,380.218 146.904,380.147 L146.904,380.144 Z M372.563,421.309 C344.321,421.309 320.923,400.645 316.622,373.652 C305.798,377.81 294.442,380.093 283.086,380.144 C260.988,380.226 240.61,372.075 225.609,357.216 L219.362,351.052 L263.128,308.546 C267.47,312.837 268.586,313.902 268.586,313.902 C272.948,318.254 278.682,319.135 282.83,319.135 C292.066,319.094 301.794,314.671 309.393,306.97 C317.052,299.3 321.395,289.613 321.333,280.295 C321.333,276.22 320.371,270.434 315.977,266.071 C315.977,266.071 265.596,214.236 221.421,170.46 L264.111,127.729 C308.113,171.372 358.974,222.777 358.974,222.777 C373.955,237.604 382.27,257.993 382.352,280.049 C382.434,289.551 380.888,299.064 378.01,308.229 C406.774,310.974 429.272,335.181 429.272,364.641 C429.262,395.955 403.836,421.309 372.563,421.309 L372.563,421.309 Z\"></path></svg>"

/***/ },
/* 28 */
/***/ function(module, exports) {

module.exports = "<svg viewBox=\"0 0 16 16\" version=\"1.1\" stroke-width=\"1\" stroke-linecap=\"square\"><path d=\"M12,0 L4,8\"></path><path d=\"M12,16 L4,8\"></path></svg>"

/***/ },
/* 29 */
/***/ function(module, exports) {

module.exports = "<svg viewBox=\"0 0 133 145\" version=\"1.1\"><g stroke-width=\"1\" fill-rule=\"evenodd\"><g transform=\"translate(66, 72) scale(-1, 1) translate(-66, -72) translate(4, 4)\" stroke-width=\"7\"><path d=\"M0.103,95.114 L36.8651,135.85\" stroke-linecap=\"square\" transform=\"translate(18.5, 115.5) scale(-1, 1) translate(-18.5, -115.5) \"></path><ellipse fill=\"none\" cx=\"71\" cy=\"53\" rx=\"53\" ry=\"53\"></ellipse></g></g></svg>"

/***/ },
/* 30 */
/***/ function(module, exports) {

module.exports = "<svg viewBox=\"0 0 123 123\" version=\"1.1\"><path d=\"M61.262,0 C27.483,0 0,27.481 0,61.26 C0,95.043 27.483,122.523 61.262,122.523 C95.04,122.523 122.527,95.043 122.527,61.26 C122.526,27.481 95.04,0 61.262,0 Z M107.376,36.046 C107.602,37.72 107.73,39.517 107.73,41.45 C107.73,46.783 106.734,52.778 103.734,60.274 L87.681,106.687 C103.305,97.576 113.814,80.649 113.814,61.261 C113.815,52.124 111.481,43.532 107.376,36.046 Z M62.184,65.857 L46.416,111.676 C51.124,113.06 56.103,113.817 61.262,113.817 C67.382,113.817 73.251,112.759 78.714,110.838 C78.573,110.613 78.445,110.374 78.34,110.114 L62.184,65.857 Z M96.74,58.608 C96.74,52.113 94.407,47.615 92.406,44.114 C89.742,39.785 87.245,36.119 87.245,31.79 C87.245,26.959 90.909,22.462 96.07,22.462 C96.303,22.462 96.524,22.491 96.751,22.504 C87.401,13.938 74.944,8.708 61.262,8.708 C42.902,8.708 26.749,18.128 17.352,32.396 C18.585,32.433 19.747,32.459 20.734,32.459 C26.231,32.459 34.74,31.792 34.74,31.792 C37.573,31.625 37.907,35.786 35.077,36.121 C35.077,36.121 32.23,36.456 29.062,36.622 L48.2,93.547 L59.701,59.054 L51.513,36.62 C48.683,36.454 46.002,36.119 46.002,36.119 C43.17,35.953 43.502,31.623 46.334,31.79 C46.334,31.79 55.013,32.457 60.177,32.457 C65.673,32.457 74.183,31.79 74.183,31.79 C77.018,31.623 77.351,35.784 74.52,36.119 C74.52,36.119 71.667,36.454 68.505,36.62 L87.497,93.114 L92.739,75.597 C95.011,68.328 96.74,63.107 96.74,58.608 Z M8.708,61.26 C8.708,82.062 20.797,100.039 38.327,108.558 L13.258,39.872 C10.342,46.408 8.708,53.641 8.708,61.26 Z\" fill-rule=\"evenodd\"></path></svg>"

/***/ },
/* 31 */
/***/ function(module, exports) {

/* (ignored) */

/***/ }
/******/ ])
});
;
//# sourceMappingURL=universal-embed-custom.map