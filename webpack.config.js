const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/js/main/index.js',
    contentScript: './src/js/main/contentScript.js',
    options: './src/js/options/index.js',
  },
  output: {
    path: path.join(__dirname, 'src/dist/'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { modules: false }], ['@babel/preset-react']],
              plugins: ['@babel/plugin-proposal-class-properties'],
            },
          },
        ],
      },
    ],
  },
};
