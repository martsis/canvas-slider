# Canvas slider
The slider is adaptive.

Examples of basic library settings

Importing Javascript
```js
import CanvasSlider from '@martsis/canvas-slider';
```

Minimal config
```html
<div id="slideshow">
    <img src='http://placekitten.com/800/480'>
    <img src='http://placekitten.com/800/800'>
    <img src='http://placekitten.com/480/800'>
</div>
```
```js
const sliderParams = {
    container: '#slideshow',    // main container
    width: 800,                 // width slide
    height: 640,                // height slide
}
const slider = new CanvasSlider(sliderParams);
slider.next(); // slide next
slider.prev(); // slide prev
```

The most popular configuration
```html
<div id="slideshow">
    <img src='http://placekitten.com/800/480'>
    <img src='http://placekitten.com/800/800'>
    <img src='http://placekitten.com/480/800'>
</div>
<div>
    <button id="#prev'">prev</button>
    <button id="#next">next</button>
</div>
```
```js
// params
const sliderParams = {
    container: '#slideshow',
    nextBtn: '#next',
    prevBtn: '#prev',
    width: 800,                 
    height: 640,
    pattern: {
        width: 320,
        height: 320,
        blur: 30
    },
    onNext: function() {
        console.log('next');
    },
    onPrev: function() {
        console.log('prev');
    }
}
new CanvasSlider(sliderParams);
```

Configuration with links to images
```html
<div id="slideshow"></div>
```
```js
const sliderParams = {
    container: '#slideshow',    // main container
    width: 800,                 // width slide
    height: 640,                // height slide
    slides: [
        'http://placekitten.com/680/880',
        'http://placekitten.com/681/881',
        'http://placekitten.com/680/881',
    ],
}
new CanvasSlider(sliderParams);
```