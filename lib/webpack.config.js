const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

const path = require('path');
const outputDir = '../js'
const entry = './js/app.js'
const cssOutput = "../css/style.css"

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: entry, // Your entry point, from where Webpack will start bundling.
        output: {
            path: path.resolve(__dirname, outputDir), // Output directory for the bundled code.
            filename: isProduction ? 'app.min.js' : 'app.dev.js', // Name of the bundled file.
        },
        resolve: {
            alias: {
                "@fa-fonts": path.resolve(__dirname, "node_modules/@fortawesome/fontawesome-free/webfonts"),
            },
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/, // Regex to match files with .js or .jsx extension.
                    exclude: /node_modules/, // Exclude the node_modules directory.
                    use: {
                        loader: 'babel-loader', // Use babel-loader to transpile the matched files.
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'], // Use the env and react presets for Babel.
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader, // Extracts CSS into separate files
                        'css-loader', // Translates CSS into CommonJS
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader, // Extracts CSS into separate files
                        'css-loader', // Translates CSS into CommonJS
                        'sass-loader', // Compiles Sass to CSS
                        {
                            loader: "sass-loader",
                            options: {
                                sassOptions: {
                                    quietDeps: true,
                                    silenceDeprecations: ['import'],
                                },
                            },
                        },
                    ],
                },
                {
                    /*test: /\.worker\.js$/,
                    use: {
                        loader: 'worker-loader',
                        options: {
                            esModule: true,
                            filename: '[name].[contenthash].js'
                        }
                    },*/
                    test: /\.worker\.js$/,
                    use: { loader: "worker-loader" },
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: cssOutput,
            }),
            new RemoveEmptyScriptsPlugin(),
        ],
        watch: !isProduction,
        watchOptions: isProduction ? {} : {
            ignored: /node_modules/,
            aggregateTimeout: 300, // The amount of time in milliseconds to wait after changes before recompiling
            poll: 1000 // Check for changes every second
        },
        devtool: isProduction ? 'source-map' : 'eval-source-map', // Source map configuration.
        optimization: {
            minimizer: [
                // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
                // `...`,
                new CssMinimizerPlugin(),
            ],
        },
    };
};
