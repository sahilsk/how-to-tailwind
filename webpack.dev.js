const webpack = require('webpack');
const path = require('path');
var tailwindcss = require('tailwindcss');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production'
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {

	
	module: {
		rules: [{
			test: /\.css$/,
			use: [
				devMode ? 'style-loader': MiniCssExtractPlugin.loader,
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
		new CleanWebpackPlugin('dist', {} ),
		new MiniCssExtractPlugin({
			filename: devMode ? '[name].css' : '[name].[hash].css',
			chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
		}),
		new HtmlWebpackPlugin({
			title: "TailWind Sk Tut",
			template:  __dirname + '/src/index.html',
			stats: {
				children: false
			}
		}),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin()
	],

	mode: 'development',
	devtool: 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, "dist"),
	  hot: true, 
	  port: 9000
    },
	optimization: {
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