//@ts-check

'use strict'

const fs = require('fs')
const path = require('path')
const CopyPlugin = require("copy-webpack-plugin")

// copy ../spellbound-ui/build/static/{js,css} to ./static/
const uiBuildDir = path.resolve(__dirname, '..', 'spellbound-ui', 'build')
const uiStaticDir = path.resolve(uiBuildDir, 'static')
const uiStaticJsDir = path.resolve(uiStaticDir, 'js')
const uiStaticCssDir = path.resolve(uiStaticDir, 'css')
const uiStaticJsFiles = fs.readdirSync(uiStaticJsDir)
const uiStaticCssFiles = fs.readdirSync(uiStaticCssDir)

const copyFile = (src, dest) => fs.copyFileSync(src, dest)
const copyFiles = (srcDir, destDir, files) => files.forEach(file => copyFile(path.resolve(srcDir, file), path.resolve(destDir, file)))

const staticDir = path.resolve(__dirname, 'static')

if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir)
}

copyFiles(uiStaticJsDir, staticDir, uiStaticJsFiles)
copyFiles(uiStaticCssDir, staticDir, uiStaticCssFiles)


//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
  target: 'node', // VS Code extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
	mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')

  entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    // modules added here also need to be added in the .vscodeignore file
  },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  plugins: [
      // copy ./static/{js,css} to dist/
      new CopyPlugin({
          patterns: [
              { from: path.resolve(__dirname, 'static/main.js'), to: 'static/main.js' },
              { from: path.resolve(__dirname, 'static/main.css'), to: 'static/main.css' },
          ],
      }),
  ],
  devtool: 'nosources-source-map',
  infrastructureLogging: {
    level: "log", // enables logging required for problem matchers
  },
}
module.exports = [ extensionConfig ]