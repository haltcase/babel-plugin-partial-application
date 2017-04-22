import { resolve } from 'path'
import { Renderer } from 'marked'

export default {
  entry: './src/index.js',
  output: {
    path: resolve(__dirname),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            ['env', {
              targets: {
                browsers: ['last 2 versions', '> 10%']
              }
            }],
            require('babel-preset-babili')
          ],
          plugins: [resolve(__dirname, '..', 'index.js')]
        }
      }
    }, {
      test: /\.md$/,
      use: [{
        loader: 'html-loader'
      }, {
        loader: 'markdown-loader',
        options: {
          renderer: new Renderer()
        }
      }]
    }]
  },
  externals: /typescript-eslint-parser/
}