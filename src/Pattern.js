// Copyright © 2020 Alexander Martsis. All rights reserved.
export default class Pattern{
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