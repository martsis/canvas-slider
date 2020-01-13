// Copyright © 2020 Alexander Martsis. All rights reserved.
import './canvas-slider.css';
import Slide from './Slide';
import Pattern from './Pattern';

export default class CanvasSlider{
    constructor({container, width, height, slides, pattern, nextBtn, prevBtn, drawn, onNext, onPrev, slideSelector}){
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

        if (typeof onNext != 'undefined'){
            this.onNext = onNext;
        }

        if (typeof onPrev != 'undefined'){
            this.onPrev = onPrev;
        }

        if (typeof slideSelector != 'undefined') {
            this.slideSelector = `${container} [data-img-src]`;
        }
        
        this._pattern = new Pattern(pattern);

        this.slides = [];
        this.currentIndex = 0;
        this.nextIndex = this.currentIndex + 1;
        
        this._slideshowContainer = document.createElement('div');
        this._slideshowContainer.className = 'canvasSlideshow-container';
        this._element.append(this._slideshowContainer);

        if (typeof slides == 'undefined'){

        }

        document.querySelectorAll(slideSelector).forEach(item => {
            if (item.src) {
                this.slides.push(item.src);
            }
        })

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
        if (this.onNext) this.onNext();

        this._nextStart();
        this.animation(this.slides[this.currentIndex].slide);
    }

    prev(){
        if (this.animating) return;
        if (this.onPrev) this.onPrev();

        this._prevStart();
        this.animation(this.slides[this.currentIndex].slide);
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
        }, 16);
    }
}