const path = require('path');

module.exports = {
  entry: './frontend/script.js', // Arquivo de entrada
  output: {
    path: path.resolve(__dirname, 'public', 'assets', 'js'),
    filename: 'bundle.js' // Arquivo gerado
  },
  mode: 'production', 
  module: {
    rules: [{exclude:/node_modules/, 
        test: /\.js$/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/env']
            }
        }
    },]
  },
  devtool: 'source-map'
};
