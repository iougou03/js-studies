const path = require("path");

module.exports = {
  devtool: 'eval-source-map',
  entry: "./src/index.ts",

  module: {
    rules: [
      {
        // transform typescript file to javascript
        test: /\.ts$/,
        use: "ts-loader",
        include: [path.resolve(__dirname, "src")],
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },

  mode: "development"
};
