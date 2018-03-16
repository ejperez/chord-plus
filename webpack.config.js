var webpack = require( 'webpack' );

module.exports = {
	entry: {
		"chord-plus": "./src/chord-plus.js",
	},
	output: {
		filename: "./[name].min.js"
	},
	module: {
		rules: [
			{
				test: /\.ejs$/,
				use: [
					{
						loader: 'ejs-compiled-loader'
					}
				]
			},
			{
				test: /\.(html)$/,
				use: [
					{
						loader: 'url-loader'
					}
				]
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				use: [
					{
						loader: 'url-loader'
					}
				]
			},
			{
				test: /\.scss$/,
				use: [{
					loader: "style-loader" // creates style nodes from JS strings
				}, {
					loader: "css-loader" // translates CSS into CommonJS
				}, {
					loader: "sass-loader" // compiles Sass to CSS
				}]
			}
		]
	}
}