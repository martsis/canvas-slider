# Canvas slideshow
```js
import CanvasSlider from '@martsis/canvas-slider';

const sliderParams = {
    container: '#slideshow',
    nextBtn: '#next',
    prevBtn: '#prev',
    slides: [
        'http://placekitten.com/800/480',
        'http://placekitten.com/800/800',
        'http://placekitten.com/480/800',
    ],
    width: 800,
    height: 640,
    pattern: {
        width: 320,
        height: 320,
        blur: 10
    },
    drawn: true,
    onNext: function() {
        console.log('next');
    },
    onPrev: function() {
        console.log('prev');
    }
}

new CanvasSlider(sliderParams);
```
