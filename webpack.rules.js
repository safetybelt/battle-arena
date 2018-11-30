module.exports = [
    {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components|public)/,
        loader: 'babel-loader',
    }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'file-loader',
    }, {
        test: /\.(woff|woff2)$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 5000,
                prefix: 'font',
            },
        }],
    }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 10000,
                mimetype: 'application/octet-stream',
            },
        }],
    }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 10000,
                mimetype: 'image/svg+xml',
            },
        }],
    }, {
        test: /\.gif/,
        exclude: /(node_modules|bower_components)/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 10000,
                mimetype: 'image/gif',
            },
        }],
    }, {
        test: /\.jpg/,
        exclude: /(node_modules|bower_components)/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 10000,
                mimetype: 'image/jpg',
            },
        }],
    }, {
        test: /\.png/,
        exclude: /(node_modules|bower_components)/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 10000,
                mimetype: 'image/png',
            },
        }],
    }, {
        test: /\.(xlsx|pdf|pptx)$/i,
        loader: 'file-loader?name=[name].[ext]',
    },

];
