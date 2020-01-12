const path = require('path');

module.exports = {
  entry: './src/canvas-slideshow.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'canvas-slideshow.js'
  }
};