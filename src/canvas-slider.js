// Copyright © 2020 Alexander Martsis. All rights reserved.
import Slide from './Slide.js';
import Pattern from './Pattern.js';

export default class CanvasSlider{
    constructor({container, width, height, slides, pattern, nextBtn, prevBtn, drawn, hover, onNext, onPrev, 
        slideSelector, loop
    }){
        if (typeof container == 'undefined'){
            console.error('Param "container" is undefined');
            return;
        }

        if (typeof loop == 'boolean'){
            this.loop = loop;
        } else {
            this.loop = false;
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
            if(!this.loop) {
                this.prevBtn.classList.add('button-disable');
                this.prevBtn.setAttribute('disabled', 'disabled');
            }
        }

        if (typeof drawn != 'undefined'){
            this.drawn = drawn;
        }

        if (typeof hover != 'undefined'){
            this.hover = hover;
        } else {
            this.hover = false;
        }

        if (typeof onNext != 'undefined'){
            this.onNext = onNext;
        }

        if (typeof onPrev != 'undefined'){
            this.onPrev = onPrev;
        }

        if (typeof slideSelector != 'undefined') {
            this.slideSelector = `${container} ${slideSelector}`;
        } else {
            this.slideSelector = `${container} img`;
        }

        this.slides = [];

        if (typeof slides == 'undefined'){
            slides = [];
        }

        document.querySelectorAll(this.slideSelector).forEach(item => {
            if (item.src) {
                slides.push(item.src);
                item.remove();
            }
        })

        this._pattern = new Pattern(pattern);

        slides.forEach(url => {
            const slide = new Slide({url, width: this.width, height: this.height, pattern: this._pattern, drawn: this.drawn, hover: this.hover});
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

        this.currentIndex = 0;
        this._nextIndex = this.currentIndex + 1;
        
        this._slideshowContainer = document.createElement('div');
        this._slideshowContainer.className = 'canvasSlideshow-container';
        this._element.append(this._slideshowContainer);

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

            if (index == this._nextIndex) {
                item.container.style.zIndex = 990;
            }
        });
    }

    _indexUpdateFinish(){
        this.slides.forEach((item, index) => {
            if (index != this.currentIndex && index != this._nextIndex){
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
        if (!this.loop && this.currentIndex >= this.slides.length - 1) return;
        if (this.onNext) this.onNext();
        if (!this.loop) {
            this.prevBtn.classList.remove('button-disable');
            this.prevBtn.removeAttribute('disabled');
        }

        this._nextStart();
        this.animation(this.slides[this.currentIndex].slide);
    }

    prev(){
        if (this.animating) return;
        if (!this.loop && this.currentIndex <= 0) return;
        if (this.onPrev) this.onPrev();
        if (!this.loop) {
            this.nextBtn.classList.remove('button-disable');
            this.nextBtn.removeAttribute('disabled');
        }

        this._prevStart();
        this.animation(this.slides[this.currentIndex].slide);
    }

    _nextStart(){
        this._nextIndex = this.currentIndex;
        this._nextIndex++;
    
        if (this._nextIndex >= this.slides.length){
            this._nextIndex = 0;
        }

        this._indexUpdateStart();
    }

    _prevStart(){
        this._nextIndex = this.currentIndex;
        this._nextIndex--;
    
        if (this._nextIndex < 0){
            this._nextIndex = this.slides.length - 1;
        }

        this._indexUpdateStart();
    }

    _prevFinish(){
        this.currentIndex--;
        
        if (this.currentIndex < 0){
            this.currentIndex = this.slides.length - 1;
        }

        if (!this.loop && this.currentIndex <= 0){
            this.prevBtn.classList.add('button-disable');
            this.prevBtn.setAttribute('disabled', 'disabled');
        }

        this._indexUpdateFinish();

        this.slides.forEach(item => {
            item.slide.restore();
        })
    }
    
    _nextFinish(){
        this.currentIndex = this._nextIndex;

        if (!this.loop && this.currentIndex >= this.slides.length - 1){
            this.nextBtn.classList.add('button-disable');
            this.nextBtn.setAttribute('disabled', 'disabled');
        }
        
        this._indexUpdateFinish();
        
        this.slides.forEach((item, index) => {
            item.slide.restore();
        })
    }

    animation(slide, prev, callback){
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
        }, 1000/60);
    }
}