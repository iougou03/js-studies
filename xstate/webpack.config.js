const path = require('path');

module.exports = {
  mode:"development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'css-loader',
          'sass-loader'
        ]
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  // entry: {
  //   app: path.resolve(__dirname, "src", "app.ts"),
  //   other: path.resolve(__dirname, "src", "other.ts"),
  //   test: path.resolve(__dirname, "src", "test.ts")
  // },
  entry: { 
    main: path.resolve(__dirname, "src", "main.ts")
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};