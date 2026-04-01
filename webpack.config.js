const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { DefinePlugin } = require("webpack");

module.exports = (env, argv) => {
  // Determine if we are in production mode based on the webpack CLI arguments
  // This allows us to conditionally run tests in development mode without affecting the production build
  const isProduction = argv.mode === "production";

  return {
    entry: "./modules/main.js",
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    devtool: "inline-source-map",
    devServer: {
      static: [
        { directory: path.resolve(__dirname, "dist") },
        { directory: path.resolve(__dirname) },
      ],
      watchFiles: ["*.html"],
      client: {
        logging: "warn", // Only log warnings and errors in the browser console
      },
      devMiddleware: {
        stats: "minimal", // Keep webpack's own output minimal in the terminal
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html",
        favicon: "./assets/icons/favicon.svg",
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: "assets", to: "assets" }],
      }),
      new DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          isProduction ? "production" : "development",
        ),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.js$/,
          use: "babel-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.svg$/,
          type: "asset/resource",
        },
      ],
    },
  };
};
