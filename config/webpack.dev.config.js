const commonPaths = require('./common-paths');

const config = {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: commonPaths.outputPath,
        compress: true,
        hot: true,
        port: 9000,
        historyApiFallback: true,
        publicPath: '/',
        inline: true,
    }
};

module.exports = config;