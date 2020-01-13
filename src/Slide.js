export default class Slide {
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