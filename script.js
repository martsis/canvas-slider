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
    constructor({url, width, height, pattern}){
        this.url = url;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = this.url;
        this._mouseDownState = false;
        this.pattern = pattern;
        this._backup;

        this.canvas = document.createElement('canvas');
        this._ctx = this.canvas.getContext('2d');
        
        this.image.addEventListener('load', () => {
            this.canvas.height = this.image.height;
            this.canvas.width = this.image.width;
            this._ctx.drawImage(this.image, 0, 0);

            this.save();
        });

        this.canvas.addEventListener('mousedown', e => {
            this._mouseDownState = true;
            this.drow(e.offsetX, e.offsetY);
        });
        this.canvas.addEventListener('mouseup', () => {
            this._mouseDownState = false;
        });
        this.canvas.addEventListener('mousemove', e => {
            if (this._mouseDownState){
                this.drow(e.offsetX, e.offsetY);
            }
        });
    }

    save(){
        this._backup = this._ctx.getImageData(0, 0, this.width, this.height);
    }

    restore(){
        this._ctx.putImageData(this._backup, 0, 0);
    }

    drow(x, y){
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
    constructor({container, width, height, slides, pattern}){
        this._element = document.querySelector(container);
        this._pattern = new Pattern(pattern);
        this.width = width;
        this.height = height;
        this.slides = [];
        this.currentIndex = 0;
        this.nextIndex = this.currentIndex + 1;
        
        this._slideshowContainer = document.createElement('div');
        this._slideshowContainer.className = 'canvasSlideshow-container';
        this._element.append(this._slideshowContainer);

        slides.forEach((url, index) => {
            const slide = new Slide({url, width: this.width, height: this.height, pattern: this._pattern});
            
            const slideContainer = document.createElement('div');
            slideContainer.className = 'canvasSlideshow-slide';
            slideContainer.append(slide.canvas);

            this.slides.push({
                slide,
                container: slideContainer
            });
        });

        this.slides.forEach((slide, index) => {
            this._slideshowContainer.append(slide.container);
        });

        this.indexUpdate();
    }

    indexUpdate(){
        this.slides.forEach((item, index) => {
            item.container.style.zIndex = 980;

            if (index == this.currentIndex) {
                item.container.style.zIndex = 1000;
            }

            if (index == this.nextIndex) {
                item.container.style.zIndex = 990;
            }
        });
    }

    next(){
        this.animation(this.slides[this.currentIndex].slide);
        
    }
    
    _nextFinish(){
        this.currentIndex++;
        
        if (this.currentIndex >= this.slides.length){
            this.currentIndex = 0;
        }

        this.nextIndex = this.currentIndex;
        this.nextIndex++;
    
        if (this.nextIndex >= this.slides.length){
            this.nextIndex = 0;
        }

        this.indexUpdate();

        this.slides.forEach(item => {
            item.slide.restore();
        })
    }

    animation(slide){
        const radius = this._pattern.width / 2 - this._pattern.blur;
        let intervalY = -radius;
        let intervalX = this.width - radius;
        let direction = 'down';
        let iteration = 0;
        const updateCanvas = setInterval(() => {
            if (iteration > this.width / this._pattern.width * 2){
                clearInterval(updateCanvas);
                this._nextFinish();
            }
            
            slide.drow(intervalX, intervalY);
            if (direction == "down" && (intervalY > this.height + radius || intervalX > this.width + this._pattern.width)){
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
                intervalY += this.height / 20;
                intervalX += this.width / 20;
            } 
    
            if (direction == "up") {
                intervalY -= this.height / 20;
                intervalX -= this.width / 20;
            }
        }, 16);
    }
}



document.addEventListener('DOMContentLoaded', function(){
    const slideshowParams = {
        container: '#slideshow',
        slides: [
            'img/slide-1.jpg',
            'img/slide-2.jpg',
            'img/slide-3.jpg'
        ],
        width: 680,
        height: 880,
        pattern: {
            width: 320,
            height: 320,
            blur: 10
        }
    }

    const canvasSlideshow = new CanvasSlideshow(slideshowParams);

    window.slideshow = canvasSlideshow;
});