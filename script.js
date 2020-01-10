const canvas = document.querySelector('#canvas');
const printElement = document.querySelector('#print');
const CANVAS_WIDTH = 680;
const CANVAS_HEIGHT = 880;
const PATTERN_WIDTH = 320;
const PATTERN_HEIGHT = 320;
const PATTERN_BLUR = 10;

class Pattern{
    constructor({width, height, blur}){
        this.width = width;

        if (typeof height != 'undefined'){
            this.height = height;
        } else {
            this.height = width;
        }

        this.blur = blur;
        this.data = [];
        
        const _centerX = (this.width - this.width % 2) / 2;
        const _centerY = (this.height - this.height % 2) / 2;
        const _radius = (_centerX < _centerY) ? _centerX : _centerY;
    
        for (let i = 0; i < this.width; i++){
            this.data[i] = [];
    
            for (let j = 0; j < this.height; j++){
                const distance = Math.sqrt(Math.pow(i - _centerX, 2) + Math.pow(j - _centerY, 2));
    
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
    }
}

class Slide {
    constructor({url, width, height, pattern, drawn}){
        this.url = url;
        this.image = new Image();
        this.image.crossOrigin = 'anonymous';
        this.image.src = this.url;
        this._mouseDownState = false;
        this.pattern = pattern;
        this._backup;

        if (typeof drawn != 'undefined'){
            this.drawn = drawn;
        } else {
            this.drawn = false;
        }

        this.canvas = document.createElement('canvas');
        this._ctx = this.canvas.getContext('2d');
        
        this.image.addEventListener('load', e => {
            if (typeof width != 'undefined'){
                this.width = width;
            } else {
                this.width = e.target.width;
            }

            if (typeof height != 'undefined') {
                this.height = height;
            } else {
                this.height = e.target.height;
            }

            this.canvas.height = this.height;
            this.canvas.width = this.width;
            
            
            const canvasRatio = this.width / this.height;
            const imageRatio = e.target.width / e.target.height;

            
            if (imageRatio > canvasRatio){
                const imagePositionX = -(e.target.width - e.target.height * canvasRatio) / 2 * (this.height / e.target.height);
                //const imagePositionX = -(e.target.width - this.width * (e.target.height / this.height)) / 2;
                //console.log(`cw: ${this.width}; ch: ${this.height}; w: ${e.target.width}; h: ${e.target.height}; r: ${imageRatio}; cr: ${canvasRatio}`, e.target.width * (e.target.height / this.height));
                const imageWidth = e.target.width * (this.height / e.target.height);
                this._ctx.drawImage(e.target, imagePositionX, 0, imageWidth, this.height);
            } else {
                const imagePositionY = -(e.target.height - this.height * (e.target.width / this.width)) / 2;
                const imageHeight = e.target.height * (this.width / e.target.width);
                this._ctx.drawImage(e.target, 0, imagePositionY, this.width, imageHeight);
            }


            this.save();
        });

        this.canvas.addEventListener('mousedown', e => {
            if (this.drawn){
                this._mouseDownState = true;
                this.draw(e.offsetX, e.offsetY);
            }
        });
        this.canvas.addEventListener('mouseup', () => {
            if (this.drawn){
                this._mouseDownState = false;
            }
        });
        this.canvas.addEventListener('mousemove', e => {
            if (this._mouseDownState && this.drawn){
                this.draw(e.offsetX, e.offsetY);
            }
        });
    }

    save(){
        this._backup = this._ctx.getImageData(0, 0, this.width, this.height);
    }

    restore(){
        this._ctx.putImageData(this._backup, 0, 0);
    }

    resize(){
        this.canvas.width 
    }

    draw(x, y){
        const positionX = this.width / this.canvas.offsetWidth * x;
        const positionY = this.height / this.canvas.offsetHeight * y;
        
        const imageDataX = positionX - this.pattern.width / 2;
        const imageDataY = positionY - this.pattern.height / 2;
        const imageData = this._ctx.getImageData(imageDataX, imageDataY, this.pattern.width, this.pattern.height);
        
        let count = 0;
    
        for (let i = 3; i < imageData.data.length; i += 4){
            const x = count % this.pattern.width;
            const y = (count - count % this.pattern.height) / this.pattern.width;
            
            count++;
    
            if (imageData.data[i] > this.pattern.data[y][x]){
                imageData.data[i] = this.pattern.data[y][x];
            }
    
        }
    
        this._ctx.putImageData(imageData, imageDataX, imageDataY);
    }
}

class CanvasSlideshow{
    constructor({container, width, height, slides, pattern, nextBtn, prevBtn, drawn}){
        if (typeof container == 'undefined'){
            console.error('Param "container" is undefined');
            return;
        }
        
        this._element = document.querySelector(container);
        this.animating = false;
        
        if (typeof width != 'undefined'){
            this.width = width;
        }
        
        if (typeof height != 'undefined'){
            this.height = height;
        }

        if (typeof nextBtn != 'undefined'){
            this.nextBtn = document.querySelector(nextBtn);
        }

        if (typeof prevBtn != 'undefined'){
            this.prevBtn = document.querySelector(prevBtn);
        }

        if (typeof drawn != 'undefined'){
            this.drawn = drawn;
        }
        
        this._pattern = new Pattern(pattern);

        this.slides = [];
        this.currentIndex = 0;
        this.nextIndex = this.currentIndex + 1;
        
        this._slideshowContainer = document.createElement('div');
        this._slideshowContainer.className = 'canvasSlideshow-container';
        this._element.append(this._slideshowContainer);

        slides.forEach(url => {
            const slide = new Slide({url, width: this.width, height: this.height, pattern: this._pattern, drawn: this.drawn});
            slide.image.addEventListener('load', () => {
                this.resize();
            });
            
            const slideContainer = document.createElement('div');
            slideContainer.className = 'canvasSlideshow-slide';
            slideContainer.append(slide.canvas);

            this.slides.push({
                slide,
                container: slideContainer
            });
        });

        this.slides.forEach(slide => {
            this._slideshowContainer.append(slide.container);
        });

        this._indexUpdateStart();
        this._indexUpdateFinish();

        window.addEventListener('resize', () => {
            this.resize();
        });

        if (this.nextBtn){
            this.nextBtn.addEventListener('click', e => {
                e.preventDefault();
                this.next();
            });
        }

        if (this.prevBtn){
            this.prevBtn.addEventListener('click', e => {
                e.preventDefault();
                this.prev();
            });
        }
    }

    _indexUpdateStart(){
        this.slides.forEach((item, index) => {
            if (index == this.currentIndex) {
                item.container.style.zIndex = 1000;
            }

            if (index == this.nextIndex) {
                item.container.style.zIndex = 990;
            }
        });
    }

    _indexUpdateFinish(){
        this.slides.forEach((item, index) => {
            if (index != this.currentIndex && index != this.nextIndex){
                item.container.style.zIndex = 0;
            }
        });
    }

    resize(){
        this._containerHeight = this.slides[0].container.offsetHeight;
        this._element.style.height = `${this._containerHeight}px`;
    }

    next(){
        if (this.animating) return;
        this._nextStart();
        this.animation(this.slides[this.currentIndex].slide);
    }

    prev(){
        if (this.animating) return;
        this._prevStart();
        this.animation(this.slides[this.currentIndex].slide, true);
    }

    _nextStart(){
        this.nextIndex = this.currentIndex;
        this.nextIndex++;
    
        if (this.nextIndex >= this.slides.length){
            this.nextIndex = 0;
        }

        this._indexUpdateStart();
    }

    _prevStart(){
        this.nextIndex = this.currentIndex;
        this.nextIndex--;
    
        if (this.nextIndex < 0){
            this.nextIndex = this.slides.length - 1;
        }

        this._indexUpdateStart();
    }

    _prevFinish(){
        this.currentIndex--;
        
        if (this.currentIndex < 0){
            this.currentIndex = this.slides.length - 1;
        }

        this._indexUpdateFinish();

        this.slides.forEach(item => {
            item.slide.restore();
        })
    }
    
    _nextFinish(){
        this.currentIndex++;
        
        if (this.currentIndex >= this.slides.length){
            this.currentIndex = 0;
        }

        this._indexUpdateFinish();

        this.slides.forEach((item, index) => {
            item.slide.restore();
        })
    }

    animation(slide, prev){
        const radius = this._pattern.width / 2 - this._pattern.blur;
        let intervalY = -radius;
        let intervalX = slide.width - radius;
        let direction = 'down';
        let iteration = 0;
        this.animating = true;
        const updateCanvas = setInterval(() => {
            if (iteration > slide.width / this._pattern.width * 2){
                clearInterval(updateCanvas);

                this.animating = false;

                if (typeof prev == 'undefined'){
                    this._nextFinish();
                } else {
                    this._prevFinish();
                }
            }
            
            slide.draw(intervalX / (this.width / slide.canvas.offsetWidth), intervalY / (this.height / slide.canvas.offsetHeight));

            if (direction == "down" && (intervalY > slide.height + radius || intervalX > slide.width + this._pattern.width)){
                intervalX -= this._pattern.width - this._pattern.blur * 2;
                direction = 'up';
                iteration++;
            }
    
            if (direction == "up" && (intervalY < -radius || intervalX < 0)) {
                intervalX -= this._pattern.width - this._pattern.blur * 2;
                direction = 'down';
                iteration++;
            }
    
            if (direction == "down"){
                intervalY += slide.height / 20;
                intervalX += slide.width / 20;
            } 
    
            if (direction == "up") {
                intervalY -= slide.height / 20;
                intervalX -= slide.width / 20;
            }
        }, 16);
    }
}



document.addEventListener('DOMContentLoaded', function(){
    const slideshowParams = {
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
        drawn: true
    }

    const canvasSlideshow = new CanvasSlideshow(slideshowParams);

    window.slideshow = canvasSlideshow;
});