"use strict";
let path = require("path");
let webpack = require("webpack");
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let nodeEnv = process.env.NODE_ENV || "development";
let isProduction = process.argv.indexOf("env='production'") !== -1;
let customPath = path.resolve(__dirname, "src");
let distPath = path.resolve(__dirname, "dist");

// 删除编译文件
let fs = require("fs");
fs.readdir(distPath, (err, files) => {
  if (err != null) {
    console.log("删除预编译文件失败");
  } else {
    for (let file of files) {
      let abspath = path.resolve(distPath, file);
      fs.stat(abspath, (err, stat) => {
        if (err) {
          console.log("err: " + err);
        } else {
          if (stat.isDirectory()) {
            // pass
          } else {
            fs.unlink(abspath);
          }
        }
      });
    }
  }
});

let extractTextPlugin = new ExtractTextPlugin("style.css");
if (isProduction) {
  extractTextPlugin = new ExtractTextPlugin("style.css");
}

let rules = [
  {
    test: /\.js$/,
    include: [
      path.resolve(__dirname, "src"),
      path.resolve(__dirname, "node_modules/react-router")
    ],
    loader: "babel-loader",
    options: {
      presets: ["react", "es2015"]
    }
  },
  {
    test: /\.(png|jpg|gif|svg)$/,
    include: [path.resolve(customPath, "misc")],
    loader: "url-loader",
    options: {
      limit: isProduction ? 1024 * 10 : 1024, // production: 10kb 的话就集成到css 去; dev: 1kb
      name: isProduction ? "misc/images/[hash].[ext]" : "[path][name].[ext]"
    }
  },
  {
    test: /\.(eot|svg|ttf|woff)$/,
    include: [path.resolve(customPath, "misc/fonts")],
    loader: "url-loader",
    options: {
      limit: isProduction ? 1024 * 10 : 1024, // production: 10kb 的话就集成到css 去; dev: 1kb
      name: isProduction ? "misc/fonts/[hash].[ext]" : "[path][name].[ext]"
    }
  }
];
if (isProduction) {
  rules.push({
    test: /\.(scss|css)$/,
    loader: extractTextPlugin.extract([
      {
        loader: "css-loader",
        options: {
          sourceMap: false,
          minimize: true
        }
      },
      {
        loader: "sass-loader",
        options: {
          sourceMap: false
        }
      }
    ])
  });
} else {
  rules.push({
    test: /\.(scss|css)$/,
    use: extractTextPlugin.extract([
      {
        loader: "css-loader",
        options: {
          sourceMap: true
        }
      },
      {
        loader: "sass-loader",
        options: {
          sourceMap: true
        }
      }
    ])
  });
}

let plugins = [];
if (isProduction) {
  plugins = [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      },
      output: {
        comments: false
      }
    }),
    extractTextPlugin,
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.js"
    })
  ];

  plugins.push(
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  );
} else {
  plugins = [
    extractTextPlugin,
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.js"
    })
  ];

  plugins.push(
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development")
      }
    })
  );
}

let output = {
  path: distPath,
  filename: "[name].js",
  publicPath: "/dist/"
};

let entry = {
  main: ["./src/scripts/main.js"],
  vendor: [
    "babel-polyfill",
    "react",
    "react-popup",
    "react-redux",
    "react-router",
    "react-router-dom",
    "react-slick",
    "tcomb-form",
    "moment"
  ]
};

let config = {
  entry: entry,
  module: {
    rules: rules
  },
  output: output,
  devServer: {
    disableHostCheck: true,
    contentBase: customPath,
    hot: false,
    https: false,
    proxy: [
      {
        context: [
          "/activity/**",
          "/main/**",
          "/lottery/**",
          "/lotterycommons/**",
          "/lotterypassword/**",
          "/lotteryWithdraw/**",
          "/lotterymember/**",
          "/lotterylogon/**",
          "/lotteryElectronic/**",
          "/lotterypay/**",
          "/member/**",
          "/password/**",
          "/message/**",
          "/flat/**",
          "/main/**",
          "/user/**",
          "/cp/**",
          "/sport/**",
          "/auth/**",
          "/rules/**",
          "/main/**",
          "/electronic/**",
          "/commons/**"
        ],
        target: "http://127.0.0.1:8080/",
        secure: false
      }
    ]
  },
  plugins: plugins
};

if (!isProduction) {
  config.devtool = "source-map";
}

module.exports = config;
