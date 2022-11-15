const path = require("path");

module.exports = {
  entry: "./ts/app.ts",
  
  mode: "production",

  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },

  resolve: {
    extensions: [".ts", ".js"]
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.js",
  },

  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 8080,
  },
};
