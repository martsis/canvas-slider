const canvas = document.querySelector('#canvas');
const printElement = document.querySelector('#print');
const CANVAS_WIDTH = 680;
const CANVAS_HEIGHT = 880;
const PATTERN_WIDTH = 320;
const PATTERN_HEIGHT = 320;
const PATTERN_BLUR = 10;

class Slide {
    constructor({url}){
        this.url = url;
        this.image = new Image();
        this.image.src = this.url;

        this._canvas = document.createElement('canvas');
        this._ctx = this._canvas.getContext('2d');
        
        this.image.addEventListener('load', () => {
            this._canvas.height = this.image.height;
            this._canvas.width = this.image.width;
            this._ctx.drawImage(this.image, 0, 0);
        });
    }
}

class DrowSlider {
    constructor({}){

    }
}

const pattenr = patternInit(PATTERN_WIDTH, PATTERN_HEIGHT, PATTERN_BLUR);

let mouseDownState = false;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const ctx = canvas.getContext('2d');

const img1 = new Image();

img1.onload = function(){
    ctx.drawImage(img1, 0, 0);
};

img1.src = 'img/slide-1.jpg';

canvas.addEventListener('mousedown', e => {
    mouseDownState = true;
    drow(e.offsetX, e.offsetY);
});
canvas.addEventListener('mouseup', e => {
    mouseDownState = false;
});
canvas.addEventListener('mousemove', e => {
    if (mouseDownState){
        drow(e.offsetX, e.offsetY);
    }
});

function animation(canvasWidth, canvasHeight, patternWidth, patternHeight, patternBlur){
    const radius = patternWidth / 2 - patternBlur;
    let intervalY = -radius;
    let intervalX = canvasWidth - radius;
    let direction = 'down';
    let iteration = 0;
    const updateCanvas = setInterval(function(){
        if (iteration > canvasWidth / patternWidth * 2){
            console.log(`done (${iteration})`);
            clearInterval(updateCanvas);
        }
        
        drow(intervalX, intervalY);
        if (direction == "down" && (intervalY > canvasHeight + radius || intervalX > canvasWidth + patternWidth)){
            intervalX -= patternWidth - patternBlur * 2;
            direction = 'up';
            iteration++;
        }

        if (direction == "up" && (intervalY < -radius || intervalX < 0)) {
            intervalX -= patternWidth - patternBlur * 2;
            direction = 'down';
            iteration++;
        }

        if (direction == "down"){
            intervalY += canvasHeight / 20;
            intervalX += canvasWidth / 20;
        } 

        if (direction == "up") {
            intervalY -= canvasHeight / 20;
            intervalX -= canvasWidth / 20;
        }

        printElement.textContent = `y: ${intervalY}; x: ${intervalX}; direction: ${direction}`;
        
    }, 16);
}

function drow(x, y){
    const imageData = ctx.getImageData(x - PATTERN_WIDTH / 2, y - PATTERN_HEIGHT / 2, PATTERN_WIDTH, PATTERN_HEIGHT);
    
    let count = 0;

    for (let i = 3; i < imageData.data.length; i += 4){
        const x = count % PATTERN_WIDTH;
        const y = (count - count % PATTERN_WIDTH) / PATTERN_WIDTH;
        
        count++;

        if (imageData.data[i] > pattenr[y][x]){
            imageData.data[i] = pattenr[y][x];
        }

    }

    ctx.putImageData(imageData, x - PATTERN_WIDTH / 2, y - PATTERN_HEIGHT / 2);
}

function patternInit(width, height, blur){
    let pattenr = [];
    
    const centerX = (width - width % 2) / 2;
    const centerY = (height - height % 2) / 2;
    const radius = (centerX < centerY) ? centerX : centerY;

    for (let i = 0; i < width; i++){
        pattenr[i] = [];

        for (let j = 0; j < height; j++){
            const distance = Math.sqrt(Math.pow(i - centerX, 2) + Math.pow(j - centerY, 2));

            if (distance <= radius) {
                if (distance > radius - blur) {
                    pattenr[i][j] = (distance - (radius - blur)) / blur * 255;
                } else {
                    pattenr[i][j] = 0;
                }
            } else {
                pattenr[i][j] = 255;
            }
        }
    }

    return pattenr;
}