const webpack = require('webpack');
const path = require('path');
var tailwindcss = require('tailwindcss');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production'
const CleanWebpackPlugin = require('clean-webpack-plugin');

//Optimization for production
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = {

	
	module: {
		rules: [{
			test: /\.css$/,
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader',
				{
					loader: 'postcss-loader',
					options: {
						plugins: function () {
							return [
								require('precss'), require('autoprefixer'), tailwindcss('./tailwind-config.js'),
								require('autoprefixer')
							];
						}
					}
				}
			]

		}]
	},

	plugins: [
		new MiniCssExtractPlugin({
			filename: devMode ? '[name].css' : '[name].[hash].css',
			chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
		}),
		new HtmlWebpackPlugin({
			title: "TailWind Sk Tut",
			template:  __dirname + '/src/index.html',
		}),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin()
	],

	mode: 'development',
	devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
	  hot: true
    },
	optimization: {
		minimizer: [
			new UglifyJSPlugin({
			  cache: true,
			  parallel: true,
			  sourceMap: true // set to true if you want JS source maps
			}),
			new OptimizeCssAssetsPlugin({})
		  ],
		splitChunks: {
			chunks: 'async',
			minSize: 30000,
			minChunks: 1,
			name: true,

			cacheGroups: {

				styles: {
					name: 'styles',
					test: /\.css$/,
					chunks: 'all',
					enforce: true
				},
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10
				}
			}
		}
	}
};