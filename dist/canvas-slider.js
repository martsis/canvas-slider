!function(t){var e={};function i(n){if(e[n])return e[n].exports;var a=e[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,i),a.l=!0,a.exports}i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)i.d(n,a,function(e){return t[e]}.bind(null,a));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";function n(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}i.r(e);var a=function(){function t(e){var i=this,n=e.url,a=e.width,r=e.height,h=e.pattern,s=e.drawn;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.url=n,this.image=new Image,this.image.crossOrigin="anonymous",this.image.src=this.url,this._mouseDownState=!1,this.pattern=h,this._backup,console.log(h),this.drawn=void 0!==s&&s,this.canvas=document.createElement("canvas"),this._ctx=this.canvas.getContext("2d"),this.image.addEventListener("load",(function(t){i.width=void 0!==a?a:t.target.width,i.height=void 0!==r?r:t.target.height,i.canvas.height=i.height,i.canvas.width=i.width;var e=i.width/i.height;if(t.target.width/t.target.height>e){var n=-(t.target.width-t.target.height*e)/2*(i.height/t.target.height),h=t.target.width*(i.height/t.target.height);i._ctx.drawImage(t.target,n,0,h,i.height)}else{var s=-(t.target.height-i.height*(t.target.width/i.width))/2,o=t.target.height*(i.width/t.target.width);i._ctx.drawImage(t.target,0,s,i.width,o)}i.save()})),this.canvas.addEventListener("mousedown",(function(t){i.drawn&&(i._mouseDownState=!0,i.draw(t.offsetX,t.offsetY))})),this.canvas.addEventListener("mouseup",(function(){i.drawn&&(i._mouseDownState=!1)})),this.canvas.addEventListener("mousemove",(function(t){i._mouseDownState&&i.drawn&&i.draw(t.offsetX,t.offsetY)}))}var e,i,a;return e=t,(i=[{key:"save",value:function(){this._backup=this._ctx.getImageData(0,0,this.width,this.height)}},{key:"restore",value:function(){this._ctx.putImageData(this._backup,0,0)}},{key:"resize",value:function(){this.canvas.width}},{key:"draw",value:function(t,e){for(var i=this.width/this.canvas.offsetWidth*t,n=this.height/this.canvas.offsetHeight*e,a=i-this.pattern.width/2,r=n-this.pattern.height/2,h=this._ctx.getImageData(a,r,this.pattern.width,this.pattern.height),s=0,o=3;o<h.data.length;o+=4){var d=s%this.pattern.width,c=(s-s%this.pattern.height)/this.pattern.width;s++,h.data[o]>this.pattern.data[c][d]&&(h.data[o]=this.pattern.data[c][d])}this._ctx.putImageData(h,a,r)}}])&&n(e.prototype,i),a&&n(e,a),t}();var r=function t(e){var i=e.width,n=e.height,a=e.blur;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.width=i,this.height=void 0!==n?n:i,this.blur=a,this.data=[];for(var r=(this.width-this.width%2)/2,h=(this.height-this.height%2)/2,s=r<h?r:h,o=0;o<this.width;o++){this.data[o]=[];for(var d=0;d<this.height;d++){var c=Math.sqrt(Math.pow(o-r,2)+Math.pow(d-h,2));c<=s?c>s-this.blur?this.data[o][d]=(c-(s-this.blur))/this.blur*255:this.data[o][d]=0:this.data[o][d]=255}}};function h(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}i.d(e,"default",(function(){return s}));var s=function(){function t(e){var i=this,n=e.container,h=e.width,s=e.height,o=e.slides,d=e.pattern,c=e.nextBtn,u=e.prevBtn,l=e.drawn,f=e.onNext,v=e.onPrev,g=e.slideSelector;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),void 0!==n?(this._element=document.querySelector(n),this.animating=!1,void 0!==h&&(this.width=h),void 0!==s&&(this.height=s),void 0!==c&&(this.nextBtn=document.querySelector(c)),void 0!==u&&(this.prevBtn=document.querySelector(u)),void 0!==l&&(this.drawn=l),void 0!==f&&(this.onNext=f),void 0!==v&&(this.onPrev=v),this.slideSelector=void 0!==g?"".concat(n," ").concat(g):"".concat(n," img"),this.slides=[],void 0===o&&(o=[]),document.querySelectorAll(this.slideSelector).forEach((function(t){t.src&&(o.push(t.src),t.remove())})),this._pattern=new r(d),o.forEach((function(t){var e=new a({url:t,width:i.width,height:i.height,pattern:i._pattern,drawn:i.drawn});e.image.addEventListener("load",(function(){i.resize()}));var n=document.createElement("div");n.className="canvasSlideshow-slide",n.append(e.canvas),i.slides.push({slide:e,container:n})})),this.currentIndex=0,this.nextIndex=this.currentIndex+1,this._slideshowContainer=document.createElement("div"),this._slideshowContainer.className="canvasSlideshow-container",this._element.append(this._slideshowContainer),this.slides.forEach((function(t){i._slideshowContainer.append(t.container)})),this._indexUpdateStart(),this._indexUpdateFinish(),window.addEventListener("resize",(function(){i.resize()})),this.nextBtn&&this.nextBtn.addEventListener("click",(function(t){t.preventDefault(),i.next()})),this.prevBtn&&this.prevBtn.addEventListener("click",(function(t){t.preventDefault(),i.prev()}))):console.error('Param "container" is undefined')}var e,i,n;return e=t,(i=[{key:"_indexUpdateStart",value:function(){var t=this;this.slides.forEach((function(e,i){i==t.currentIndex&&(e.container.style.zIndex=1e3),i==t.nextIndex&&(e.container.style.zIndex=990)}))}},{key:"_indexUpdateFinish",value:function(){var t=this;this.slides.forEach((function(e,i){i!=t.currentIndex&&i!=t.nextIndex&&(e.container.style.zIndex=0)}))}},{key:"resize",value:function(){this._containerHeight=this.slides[0].container.offsetHeight,this._element.style.height="".concat(this._containerHeight,"px")}},{key:"next",value:function(){this.animating||(this.onNext&&this.onNext(),this._nextStart(),this.animation(this.slides[this.currentIndex].slide))}},{key:"prev",value:function(){this.animating||(this.onPrev&&this.onPrev(),this._prevStart(),this.animation(this.slides[this.currentIndex].slide))}},{key:"_nextStart",value:function(){this.nextIndex=this.currentIndex,this.nextIndex++,this.nextIndex>=this.slides.length&&(this.nextIndex=0),this._indexUpdateStart()}},{key:"_prevStart",value:function(){this.nextIndex=this.currentIndex,this.nextIndex--,this.nextIndex<0&&(this.nextIndex=this.slides.length-1),this._indexUpdateStart()}},{key:"_prevFinish",value:function(){this.currentIndex--,this.currentIndex<0&&(this.currentIndex=this.slides.length-1),this._indexUpdateFinish(),this.slides.forEach((function(t){t.slide.restore()}))}},{key:"_nextFinish",value:function(){this.currentIndex++,this.currentIndex>=this.slides.length&&(this.currentIndex=0),this._indexUpdateFinish(),this.slides.forEach((function(t,e){t.slide.restore()}))}},{key:"animation",value:function(t,e,i){var n=this,a=this._pattern.width/2-this._pattern.blur,r=-a,h=t.width-a,s="down",o=0;this.animating=!0;var d=setInterval((function(){o>t.width/n._pattern.width*2&&(clearInterval(d),n.animating=!1,void 0===e?n._nextFinish():n._prevFinish()),t.draw(h/(n.width/t.canvas.offsetWidth),r/(n.height/t.canvas.offsetHeight)),"down"==s&&(r>t.height+a||h>t.width+n._pattern.width)&&(h-=n._pattern.width-2*n._pattern.blur,s="up",o++),"up"==s&&(r<-a||h<0)&&(h-=n._pattern.width-2*n._pattern.blur,s="down",o++),"down"==s&&(r+=t.height/20,h+=t.width/20),"up"==s&&(r-=t.height/20,h-=t.width/20)}),16)}}])&&h(e.prototype,i),n&&h(e,n),t}()}]);
//# sourceMappingURL=canvas-slider.js.map