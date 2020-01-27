// Copyright © 2020 Alexander Martsis. All rights reserved.
// Licensed under MIT (https://github.com/martsis/canvas-slider/blob/master/LICENSE)
import Pattern from './Pattern.js';

export default class Slide {
    constructor({canvas, image, url, width, height, pattern, drawn, hover, container}){
        if (typeof canvas != 'undefined'){
            this.canvas = canvas;
        }

        if (typeof container == 'string'){
            this.container = container;
            this._containerElement = document.querySelector(container);
        }

        if (typeof image != 'undefined'){
            this.image = image;
            this.image.crossOrigin = 'anonymous';
        } else {
            if (typeof url != 'undefined'){
                this.url = url;
            } 

            if (typeof this.url == 'string'){
                this.image = new Image();
                this.image.crossOrigin = 'anonymous';
                this.image.src = this.url;
            } else {
                console.log('url empty')
            }
        }
        
        if (typeof pattern == 'undefined'){
            this.pattern = new Pattern({
                width: 100,
                height: 100,
                blur: 20
            });
        } else {
            this.pattern = pattern;
        }

        this._mouseDownState = false;
        this._backup;

        if (typeof hover != 'undefined'){
            this.hover = hover;
        } else {
            this.hover = false;
        }

        if (typeof drawn != 'undefined'){
            this.drawn = drawn;
        } else {
            this.drawn = false;
        }

        this.canvas = document.createElement('canvas');
        this._ctx = this.canvas.getContext('2d');
        
        if (typeof this._containerElement != 'undefined'){
            this._containerElement.append(this.canvas);
        }
        
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
                const imageWidth = e.target.width * (this.height / e.target.height);
                this._ctx.drawImage(e.target, imagePositionX, 0, imageWidth, this.height);
            } else {
                const imagePositionY = -(e.target.height - this.height * (e.target.width / this.width)) / 2;
                const imageHeight = e.target.height * (this.width / e.target.width);
                this._ctx.drawImage(e.target, 0, imagePositionY, this.width, imageHeight);
            }

            this.save();

            if (this.hover || this.drawn){
                window.addEventListener('mousemove', e => {
                    if (this.drawn && !this._mouseDownState) return;
                    const x = e.pageX - window.scrollX - this.canvas.getBoundingClientRect().x;
                    const y = e.pageY - window.scrollY - this.canvas.getBoundingClientRect().y;

                    //console.log(x, y)
                    this.draw(x, y);
                });
            }
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
        });
    }

    save(){
        this._backup = this._ctx.getImageData(0, 0, this.width, this.height);
    }

    restore(){
        this._ctx.putImageData(this._backup, 0, 0);
    }

    draw(x, y){
        if (x < -(this.pattern.width / 2) ||
            x > (this.width + this.pattern.width / 2) ||
            y < -(this.pattern.height / 2) ||
            y > (this.height + this.pattern.height / 2)) return;
        
        const positionX = this.width / this.canvas.offsetWidth * x;
        const positionY = this.height / this.canvas.offsetHeight * y;
        
        const imageDataX = positionX - this.pattern.width / 2;
        const imageDataY = positionY - this.pattern.height / 2;
        const imageData = this._ctx.getImageData(imageDataX, imageDataY, this.pattern.width, this.pattern.height);

        console.log( this.pattern.width, this.pattern.height, imageData.data.length / 4 / 100);
        
        let count = 0;
    
        for (let i = 3; i < imageData.data.length; i += 4){
            const x = count % this.pattern.width;
            const y = (count - count % this.pattern.height) / this.pattern.width;
            
            count++;
    
            try{
                if (imageData.data[i] && imageData.data[i] > this.pattern.data[y][x]){
                    imageData.data[i] = this.pattern.data[y][x];
                }
            } catch(err){
                //console.log(err, i, x, y, this.pattern.data);
            }
        }
    
        this._ctx.putImageData(imageData, imageDataX, imageDataY);
    }
}