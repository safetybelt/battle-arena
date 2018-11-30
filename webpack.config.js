'use strict';
const webpack = require('webpack');
const path = require('path');
const rules = require('./webpack.rules');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || '8889';

rules.push({
    test: /\.css$/,
    exclude: /[\/\\]src[\/\\]/,
    use: [{
        loader: 'style-loader',
        options: {
            sourceMap: true,
        },
    }, {
        loader: 'css-loader',
    }, {
        loader: 'resolve-url-loader',
    }],
});

rules.push({
    test: /\.scss$/,
    exclude: /[\/\\](node_modules|bower_components|public)[\/\\]/,
    use: [{
        loader: 'style-loader',
        options: {
            sourceMap: true,
        },
    }, {
        loader: 'css-loader',
        options: {
            importLoaders: 1,
        },
    }, {
        loader: 'postcss-loader',
        options: {
            sourceMap: true,
        },
    }, {
        loader: 'resolve-url-loader',
    }, {
        loader: 'sass-loader',
    }],
});

module.exports = {
    entry: [
        'react-hot-loader/patch',
        './src/index.jsx',
    ],
    devtool: process.env.WEBPACK_DEVTOOL || 'cheap-module-source-map',
    output: {
        path: path.join(__dirname, 'public'),
        publicPath: `http://${HOST}:${PORT}/`,
        filename: 'bundle.js',
    },
    resolve: {
        alias: {
            actions: path.resolve(__dirname, 'src', 'actions'),
            components: path.resolve(__dirname, 'src', 'components'),
            static: path.resolve(__dirname, 'src', 'static'),
            icons: path.resolve(__dirname, 'src', 'static', 'img', 'icons'),
            img: path.resolve(__dirname, 'src', 'static', 'img'),
            css: path.resolve(__dirname, 'src', 'static', 'css'),
            containers: path.resolve(__dirname, 'src', 'containers'),
            reducers: path.resolve(__dirname, 'src', 'reducers'),
            utils: path.resolve(__dirname, 'src', 'utils'),
            libs: path.resolve(__dirname, 'src', 'libs'),
            data: path.resolve(__dirname, 'src', 'static', 'data'),
        },
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules,
    },
    devServer: {
        contentBase: './public',
        // do not print bundle build stats
        noInfo: true,
        // enable HMR
        hot: true,
        // embed the webpack-dev-server runtime into the bundle
        inline: true,
        // serve index.html in place of 404 responses to allow HTML5 history
        historyApiFallback: true,
        port: PORT,
        host: HOST,
        headers: { 'Access-Control-Allow-Origin': '*' },
        disableHostCheck: true,
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './src/template.html',
        }),
    ],
};
