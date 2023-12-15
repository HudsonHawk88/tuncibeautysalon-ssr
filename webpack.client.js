// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const target = isProduction ? 'web' : 'browserslist';
require('dotenv').config();
const { EnvironmentPlugin, DefinePlugin } = require('webpack');

module.exports = {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.js',

    output: {
        path: path.resolve(__dirname, 'build/public'),
        filename: 'static/scripts/[name].js',
        chunkFilename: 'static/scripts/[name].js',
        publicPath: '/',
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public' }
            ]
        }),
        new DefinePlugin({
            __isBrowser__: 'true'
        }),
        new EnvironmentPlugin({
            reachaptchaApiKey: process.env.REACT_APP_recaptchakey,
            reachaptchaSecretKey: process.env.REACT_APP_recaptchasecret,
            shareUrl: process.env.REACT_APP_url,
            staticUrl: process.env.REACT_APP_staticUrl,
            mainUrl: process.env.REACT_APP_mainUrl,
            devvaltoKey: process.env.REACT_APP_devvaltoAK,
            lang: process.env.REACT_APP_defaultlang
        }),
        new HtmlWebpackPlugin({
            template: './indexTemplate.html',
            inject: true
        })
    ],
    /* devtool: 'source-map', */
    devServer: {
        hot: true,
        host: '192.168.11.167',
        port: 3000,
        historyApiFallback: true
    },
    ignoreWarnings: [() => true],
    target: target, // in order too ignore built-in modules like path, fs, etc.
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react', '@babel/preset-env']
                        }
                    },
                    'source-map-loader'
                ],
                resolve: {
                    fullySpecified: false
                }
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            // Prefer `dart-sass`
                            implementation: require('sass'),
                            sassOptions: {
                                outputStyle: 'compressed'
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    },
    resolve: {
        fallback: {
            child_process: false,
            crypto: false,
            http: false,
            https: false,
            path: false,
            stream: false,
            fs: false,
            os: false,
            uglify_js: false,
            esbuild: false,
            tty: false,
            constants: false,
            vm: false,
            zlib: false,
            process: false
        }
    }
};
