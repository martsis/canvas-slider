/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/canvas-slider.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Pattern.js":
/*!************************!*\
  !*** ./src/Pattern.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Pattern; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Copyright © 2020 Alexander Martsis. All rights reserved.
// Licensed under MIT (https://github.com/martsis/canvas-slider/blob/master/LICENSE)
var Pattern = function Pattern(_ref) {
  var width = _ref.width,
      height = _ref.height,
      blur = _ref.blur;

  _classCallCheck(this, Pattern);

  this.width = width;

  if (typeof height != 'undefined') {
    this.height = height;
  } else {
    this.height = width;
  }

  this.blur = blur;
  this.data = [];

  var _centerX = (this.width - this.width % 2) / 2;

  var _centerY = (this.height - this.height % 2) / 2;

  var _radius = _centerX < _centerY ? _centerX : _centerY;

  for (var i = 0; i < this.width; i++) {
    this.data[i] = [];

    for (var j = 0; j < this.height; j++) {
      var distance = Math.sqrt(Math.pow(i - _centerX, 2) + Math.pow(j - _centerY, 2));

      if (distance <= _radius) {
        if (distance > _radius - this.blur) {
          this.data[i][j] = (distance - (_radius - this.blur)) / this.blur * 255;
        } else {
          this.data[i][j] = 0;
        }
      } else {
        this.data[i][j] = 255;
      }
    }
  }
};



/***/ }),

/***/ "./src/Slide.js":
/*!**********************!*\
  !*** ./src/Slide.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Slide; });
/* harmony import */ var _Pattern_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Pattern.js */ "./src/Pattern.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Copyright © 2020 Alexander Martsis. All rights reserved.
// Licensed under MIT (https://github.com/martsis/canvas-slider/blob/master/LICENSE)


var Slide =
/*#__PURE__*/
function () {
  function Slide(_ref) {
    var _this = this;

    var canvas = _ref.canvas,
        image = _ref.image,
        url = _ref.url,
        width = _ref.width,
        height = _ref.height,
        pattern = _ref.pattern,
        drawn = _ref.drawn,
        hover = _ref.hover,
        container = _ref.container;

    _classCallCheck(this, Slide);

    if (typeof canvas != 'undefined') {
      this.canvas = canvas;
    }

    if (typeof container == 'string') {
      this.container = container;
      this._containerElement = document.querySelector(container);
    }

    if (typeof image != 'undefined') {
      this.image = image;
      this.image.crossOrigin = 'anonymous';
    } else {
      if (typeof url != 'undefined') {
        this.url = url;
      }

      if (typeof this.url == 'string') {
        this.image = new Image();
        this.image.crossOrigin = 'anonymous';
        this.image.src = this.url;
      } else {
        console.log('url empty');
      }
    }

    if (typeof pattern == 'undefined') {
      this.pattern = new _Pattern_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
        width: 100,
        height: 100,
        blur: 20
      });
    } else {
      this.pattern = pattern;
    }

    this._mouseDownState = false;
    this._backup;

    if (typeof hover != 'undefined') {
      this.hover = hover;
    } else {
      this.hover = false;
    }

    if (typeof drawn != 'undefined') {
      this.drawn = drawn;
    } else {
      this.drawn = false;
    }

    this.canvas = document.createElement('canvas');
    this._ctx = this.canvas.getContext('2d');

    if (typeof this._containerElement != 'undefined') {
      this._containerElement.append(this.canvas);
    }

    this.image.addEventListener('load', function (e) {
      if (typeof width != 'undefined') {
        _this.width = width;
      } else {
        _this.width = e.target.width;
      }

      if (typeof height != 'undefined') {
        _this.height = height;
      } else {
        _this.height = e.target.height;
      }

      _this.canvas.height = _this.height;
      _this.canvas.width = _this.width;
      var canvasRatio = _this.width / _this.height;
      var imageRatio = e.target.width / e.target.height;

      if (imageRatio > canvasRatio) {
        var imagePositionX = -(e.target.width - e.target.height * canvasRatio) / 2 * (_this.height / e.target.height);
        var imageWidth = e.target.width * (_this.height / e.target.height);

        _this._ctx.drawImage(e.target, imagePositionX, 0, imageWidth, _this.height);
      } else {
        var imagePositionY = -(e.target.height - _this.height * (e.target.width / _this.width)) / 2;
        var imageHeight = e.target.height * (_this.width / e.target.width);

        _this._ctx.drawImage(e.target, 0, imagePositionY, _this.width, imageHeight);
      }

      _this.save();

      if (_this.hover || _this.drawn) {
        window.addEventListener('mousemove', function (e) {
          if (_this.drawn && !_this._mouseDownState) return;

          _this.draw(e.pageX - window.scrollX - _this.canvas.getBoundingClientRect().x, e.pageY - window.scrollY - _this.canvas.getBoundingClientRect().y);
        });
      }

      _this.canvas.addEventListener('mousedown', function (e) {
        if (_this.drawn) {
          _this._mouseDownState = true;

          _this.draw(e.offsetX, e.offsetY);
        }
      });

      _this.canvas.addEventListener('mouseup', function () {
        if (_this.drawn) {
          _this._mouseDownState = false;
        }
      });
    });
  }

  _createClass(Slide, [{
    key: "save",
    value: function save() {
      this._backup = this._ctx.getImageData(0, 0, this.width, this.height);
    }
  }, {
    key: "restore",
    value: function restore() {
      this._ctx.putImageData(this._backup, 0, 0);
    }
  }, {
    key: "draw",
    value: function draw(x, y) {
      var positionX = this.width / this.canvas.offsetWidth * x;
      var positionY = this.height / this.canvas.offsetHeight * y;
      var imageDataX = positionX - this.pattern.width / 2;
      var imageDataY = positionY - this.pattern.height / 2;

      var imageData = this._ctx.getImageData(imageDataX, imageDataY, this.pattern.width, this.pattern.height);

      var count = 0;

      for (var i = 3; i < imageData.data.length; i += 4) {
        var _x = count % this.pattern.width;

        var _y = (count - count % this.pattern.height) / this.pattern.width;

        count++;

        if (imageData.data[i] > this.pattern.data[_y][_x]) {
          imageData.data[i] = this.pattern.data[_y][_x];
        }
      }

      this._ctx.putImageData(imageData, imageDataX, imageDataY);
    }
  }]);

  return Slide;
}();



/***/ }),

/***/ "./src/canvas-slider.js":
/*!******************************!*\
  !*** ./src/canvas-slider.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CanvasSlider; });
/* harmony import */ var _Slide_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Slide.js */ "./src/Slide.js");
/* harmony import */ var _Pattern_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Pattern.js */ "./src/Pattern.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Canvas Slider
// Copyright © 2020 Alexander Martsis. All rights reserved.
// Licensed under MIT (https://github.com/martsis/canvas-slider/blob/master/LICENSE)



var CanvasSlider =
/*#__PURE__*/
function () {
  function CanvasSlider(_ref) {
    var _this = this;

    var container = _ref.container,
        width = _ref.width,
        height = _ref.height,
        slides = _ref.slides,
        pattern = _ref.pattern,
        nextBtn = _ref.nextBtn,
        prevBtn = _ref.prevBtn,
        drawn = _ref.drawn,
        hover = _ref.hover,
        onNext = _ref.onNext,
        onPrev = _ref.onPrev,
        slideSelector = _ref.slideSelector,
        loop = _ref.loop;

    _classCallCheck(this, CanvasSlider);

    if (typeof container == 'undefined') {
      console.error('Param "container" is undefined');
      return;
    }

    if (typeof loop == 'boolean') {
      this.loop = loop;
    } else {
      this.loop = false;
    }

    this._element = document.querySelector(container);
    this.animating = false;

    if (typeof width != 'undefined') {
      this.width = width;
    }

    if (typeof height != 'undefined') {
      this.height = height;
    }

    if (typeof nextBtn != 'undefined') {
      this.nextBtn = document.querySelector(nextBtn);
    }

    if (typeof prevBtn != 'undefined') {
      this.prevBtn = document.querySelector(prevBtn);

      if (!this.loop) {
        this.prevBtn.classList.add('button-disabled');
        this.prevBtn.setAttribute('disabled', 'disabled');
      }
    }

    if (typeof drawn != 'undefined') {
      this.drawn = drawn;
    }

    if (typeof hover != 'undefined') {
      this.hover = hover;
    } else {
      this.hover = false;
    }

    if (typeof onNext != 'undefined') {
      this.onNext = onNext;
    }

    if (typeof onPrev != 'undefined') {
      this.onPrev = onPrev;
    }

    if (typeof slideSelector != 'undefined') {
      this.slideSelector = "".concat(container, " ").concat(slideSelector);
    } else {
      this.slideSelector = "".concat(container, " img");
    }

    this.slides = [];

    if (typeof slides == 'undefined') {
      slides = [];
    }

    document.querySelectorAll(this.slideSelector).forEach(function (item) {
      if (item.src) {
        slides.push(item.src);
        item.remove();
      }
    });
    this._pattern = new _Pattern_js__WEBPACK_IMPORTED_MODULE_1__["default"](pattern);
    slides.forEach(function (url) {
      var slide = new _Slide_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
        url: url,
        width: _this.width,
        height: _this.height,
        pattern: _this._pattern,
        drawn: _this.drawn,
        hover: _this.hover
      });
      slide.image.addEventListener('load', function () {
        _this.resize();
      });
      var slideContainer = document.createElement('div');
      slideContainer.className = 'canvasSlideshow-slide';
      slideContainer.append(slide.canvas);

      _this.slides.push({
        slide: slide,
        container: slideContainer
      });
    });
    this.currentIndex = 0;
    this._nextIndex = this.currentIndex + 1;
    this._slideshowContainer = document.createElement('div');
    this._slideshowContainer.className = 'canvasSlideshow-container';

    this._element.append(this._slideshowContainer);

    this.slides.forEach(function (slide) {
      _this._slideshowContainer.append(slide.container);
    });

    this._indexUpdateStart();

    this._indexUpdateFinish();

    window.addEventListener('resize', function () {
      _this.resize();
    });

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', function (e) {
        e.preventDefault();

        _this.next();
      });
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', function (e) {
        e.preventDefault();

        _this.prev();
      });
    }
  }

  _createClass(CanvasSlider, [{
    key: "_indexUpdateStart",
    value: function _indexUpdateStart() {
      var _this2 = this;

      this.slides.forEach(function (item, index) {
        if (index == _this2.currentIndex) {
          item.container.style.zIndex = 1000;
        }

        if (index == _this2._nextIndex) {
          item.container.style.zIndex = 990;
        }
      });
    }
  }, {
    key: "_indexUpdateFinish",
    value: function _indexUpdateFinish() {
      var _this3 = this;

      this.slides.forEach(function (item, index) {
        if (index != _this3.currentIndex && index != _this3._nextIndex) {
          item.container.style.zIndex = 0;
        }
      });
    }
  }, {
    key: "resize",
    value: function resize() {
      this._containerHeight = this.slides[0].container.offsetHeight;
      this._element.style.height = "".concat(this._containerHeight, "px");
    }
  }, {
    key: "next",
    value: function next() {
      if (this.animating) return;
      if (!this.loop && this.currentIndex >= this.slides.length - 1) return;
      if (this.onNext) this.onNext();

      if (!this.loop && typeof this.prevBtn != 'undefined') {
        this.prevBtn.classList.remove('button-disabled');
        this.prevBtn.removeAttribute('disabled');
      }

      this._nextStart();

      this.animation(this.slides[this.currentIndex].slide);
    }
  }, {
    key: "prev",
    value: function prev() {
      if (this.animating) return;
      if (!this.loop && this.currentIndex <= 0) return;
      if (this.onPrev) this.onPrev();

      if (!this.loop) {
        this.nextBtn.classList.remove('button-disabled');
        this.nextBtn.removeAttribute('disabled');
      }

      this._prevStart();

      this.animation(this.slides[this.currentIndex].slide);
    }
  }, {
    key: "_nextStart",
    value: function _nextStart() {
      this._nextIndex = this.currentIndex;
      this._nextIndex++;

      if (!this.loop && this._nextIndex >= this.slides.length - 1) {
        this.nextBtn.classList.add('button-disabled');
        this.nextBtn.setAttribute('disabled', 'disabled');
      }

      if (this._nextIndex >= this.slides.length) {
        this._nextIndex = 0;
      }

      this._indexUpdateStart();
    }
  }, {
    key: "_prevStart",
    value: function _prevStart() {
      this._nextIndex = this.currentIndex;
      this._nextIndex--;

      if (!this.loop && this._nextIndex <= 0) {
        this.prevBtn.classList.add('button-disabledd');
        this.prevBtn.setAttribute('disabled', 'disabled');
      }

      if (this._nextIndex < 0) {
        this._nextIndex = this.slides.length - 1;
      }

      this._indexUpdateStart();
    }
  }, {
    key: "_prevFinish",
    value: function _prevFinish() {
      this.currentIndex--;

      if (this.currentIndex < 0) {
        this.currentIndex = this.slides.length - 1;
      }

      this._indexUpdateFinish();

      this.slides.forEach(function (item) {
        item.slide.restore();
      });
    }
  }, {
    key: "_nextFinish",
    value: function _nextFinish() {
      this.currentIndex = this._nextIndex;

      this._indexUpdateFinish();

      this.slides.forEach(function (item, index) {
        item.slide.restore();
      });
    }
  }, {
    key: "animation",
    value: function animation(slide, prev, callback) {
      var _this4 = this;

      var radius = this._pattern.width / 2 - this._pattern.blur;
      var intervalY = -radius;
      var intervalX = slide.width - radius;
      var direction = 'down';
      var iteration = 0;
      this.animating = true;
      var updateCanvas = setInterval(function () {
        if (iteration > slide.width / _this4._pattern.width * 2) {
          clearInterval(updateCanvas);
          _this4.animating = false;

          if (typeof prev == 'undefined') {
            _this4._nextFinish();
          } else {
            _this4._prevFinish();
          }
        }

        slide.draw(intervalX / (_this4.width / slide.canvas.offsetWidth), intervalY / (_this4.height / slide.canvas.offsetHeight));

        if (direction == "down" && (intervalY > slide.height + radius || intervalX > slide.width + _this4._pattern.width)) {
          intervalX -= _this4._pattern.width - _this4._pattern.blur * 2;
          direction = 'up';
          iteration++;
        }

        if (direction == "up" && (intervalY < -radius || intervalX < 0)) {
          intervalX -= _this4._pattern.width - _this4._pattern.blur * 2;
          direction = 'down';
          iteration++;
        }

        if (direction == "down") {
          intervalY += slide.height / 20;
          intervalX += slide.width / 20;
        }

        if (direction == "up") {
          intervalY -= slide.height / 20;
          intervalX -= slide.width / 20;
        }
      }, 1000 / 60);
    }
  }]);

  return CanvasSlider;
}();



/***/ })

/******/ });
//# sourceMappingURL=canvas-slider.js.map