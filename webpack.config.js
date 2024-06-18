const path = require("path");
const AngularWebpackPlugin = require("@ngtools/webpack").AngularWebpackPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = (env) => {
  const isProduction = env.prod === "1";
  return {
    name: "ngtool_webpack_show",
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? "source-map" : "inline-source-map",
    entry: "./index.ts",
    devServer: {
      port: 8080,
    },
    module: {
      rules: [
        {
          test: /\.[cm]?[tj]sx?$/,
          resolve: { fullySpecified: false },
          exclude:
            /[\\/]node_modules[/\\](?:core-js|@babel|tslib|web-animations-js|web-streams-polyfill|whatwg-url)[/\\]/,
          use: [
            {
              loader:
                "@angular-devkit/build-angular/src/tools/babel/webpack-loader",
              options: {
                aot: true,
                optimize: isProduction,
              },
            },
            // { loader: "ifdef-loader", options: { DEBUG: !isProduction } }, // use AngularWebpackPlugin::sourceModifiers
            { loader: path.resolve(__dirname, "./scripts/trace-loader.cjs") }, // log source code in pipeline
            {
              loader: "@ngtools/webpack",
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "index.html",
        templateParameters: {
          isProduction: isProduction,
        },
      }),
      new AngularWebpackPlugin({
        tsConfigPath: "tsconfig.json",
        jitMode: false,
        directTemplateLoading: true,
        emitNgModuleScope: !isProduction,
        emitClassMetadata: false,
        compilerOptions: {
          sourceMap: true,
          declaration: false,
          declarationMap: false,
          preserveSymlinks: false,
        },
        sourceModifier: [
          {
            filter: (source, path) => !/node_modules/.test(path),
            modifier: (source, path) => {
              const { parse } = require("ifdef-loader/preprocessor");
              return parse(source, {
                DEBUG: !isProduction,
              });
            },
          },
        ],
      }),
    ],
  };
};
