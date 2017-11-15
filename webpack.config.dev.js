const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

module.exports = {
    entry: [
        'webpack-hot-middleware/client',
        path.resolve(__dirname, 'src')
    ],
    resolve: {
        extensions: ['', '.jsx', '.js', '.json', '.scss'],
        modulesDirectories: ['node_modules', path.join(__dirname, 'src')]
    },
    output: {
        path: path.resolve(__dirname, 'src'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
                WEBPACK: true
            }
        }),
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
                include: path.resolve(__dirname, 'src'),
                query: {
                    presets: [ 'react-hmre' ]
                }
            },
            {
                test: /\.scss/,
                loader: 'style!css!postcss!sass',
                include: path.resolve(__dirname, 'src')
            },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
        ]
    },
    postcss: function() {
        return [autoprefixer];
    }
};
