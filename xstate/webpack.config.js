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
    main: path.resolve(__dirname, "src", "main.ts"),
    prac1: path.resolve(__dirname,"src", "parent-child.ts"),
    prac2: path.resolve(__dirname, "src", "context-test.ts")
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};