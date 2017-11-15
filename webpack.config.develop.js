const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let constants = require('./src/constants/constants');
const fs = require('fs');
const content = 'module.exports = {API_URL: "' + constants.DEV_API + '",ENV:"production"};';

try{
    fs.writeFileSync('./apiConfig.js', content);
    console.log('Api config file was successfuly generated.');
}catch (e){
    console.log("Cannot write file ", e);
}

module.exports = {
    entry: path.resolve(__dirname, 'src'),
    resolve: {
        extensions: ['', '.jsx', '.js', '.json', '.scss'],
        modulesDirectories: ['node_modules', path.join(__dirname, 'src')],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                WEBPACK: true
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src', 'assets'),
                to: path.resolve(__dirname, 'dist', 'assets')
            }
        ]),
        new ExtractTextPlugin('bundle.css'),
        //jquery
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ],
    module: {
        loaders: [
            {include: /\.json$/, loaders: ["json-loader"]},
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel',
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.scss/,
                loader: ExtractTextPlugin.extract('style', 'css!sass!postcss'),
                include: path.resolve(__dirname, 'src')
            },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
        ]
    },
    postcss: function() {
        return [autoprefixer];
    }
};
