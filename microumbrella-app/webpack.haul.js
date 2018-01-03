var path = require("path");
var webpack = require("webpack");

module.exports = ({ platform }, defaults) => {
  return {
    plugins: [
      new webpack.ContextReplacementPlugin(
        /\.\/locale$/,
        "empty-module",
        false,
        /js$/
      )
    ],
    module: {
      ...defaults.module,
      rules: [
        {
          test: /\.js?$/,
          exclude: "/node_modules/",
          use: [
            {
              loader: "babel-loader",
              options: {
                sourceMaps: true,
                presets: [
                  "react-native-stage-0/decorator-support",
                  "react-native-dotenv"
                ]
              }
            }
          ]
        },
        ...defaults.module.rules
      ]
    },
    entry: `./index.${platform}.js`,
    devtool: "source-map",
    resolve: {
      ...defaults.resolve,
      modules: [path.resolve(__dirname, "node_modules"), "node_modules"]
    }
  };
};
