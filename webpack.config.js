const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports = {
    entry: './src/canvas-slideshow.js',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'canvas-slideshow.js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.s?css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../dist/',
                        }
                    },
                    'css-loader',
                    'sass-loader',
                ]
            }
        ],
    },
    plugins: [new MiniCssExtractPlugin({
        filename: 'canvas-slideshow.css',
        chunkFilename: '[id].css'
    })],
};