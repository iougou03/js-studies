const path = require('path');

module.exports = {
  entry: './src/app.ts',
  mode:"development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  entry: {
    app: path.resolve(__dirname, "src", "app.ts"),
    other: path.resolve(__dirname, "src", "other.ts"),
    test: path.resolve(__dirname, "src", "test.ts")
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};