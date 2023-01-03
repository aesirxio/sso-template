const MediaQueryPlugin = require("r-digital-template-library/media-query-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");
const fs = require("fs");
const entry = "src/entry/";
const wwwDir = path.resolve(__dirname, "./dist");
const projectname = "sso";

const breakpoints = require(__dirname + "/src/utils/breakpoints.js");

var queryData = {};
var breakpointsData = [];

Object.keys(breakpoints).map(function (screen) {
  Object.keys(breakpoints[screen]).map(function (breakpoint) {
    queryData["(min-width: " + breakpoints[screen][breakpoint] + ")"] = screen;

    breakpointsData.push(breakpoint + ":" + breakpoints[screen][breakpoint]);
  });
});

const getAllFiles = function (dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else if (path.extname(file) == ".js" || path.extname(file) == ".scss") {
      let fullPath = path.join(dirPath, "/", file);
      let fileName = fullPath
        .replace(entry, "")
        .replace(/\//g, ".")
        .replace(".js", "")
        .replace(".scss", "");

      if (arrayOfFiles[fileName]) {
        arrayOfFiles[fileName].push(path.resolve(__dirname, fullPath));
      } else {
        arrayOfFiles[fileName] = [path.resolve(__dirname, fullPath)];
      }
    }
  });

  return arrayOfFiles;
};

const entryData = Object.assign({}, getAllFiles(entry));

const sassData = {
  loader: "sass-loader",
  options: {
    additionalData:
      `
      $grid-breakpoints: (
     ` +
      breakpointsData.join(",").replace(/\'/g, "") +
      `
    ) !default;
    @import "src/scss/utils/bootstrap";`,
  },
};

const sassLoader = {
  test: /\.(scss)$/,
  use: [
    MiniCssExtractPlugin.loader,
    "css-loader",
    MediaQueryPlugin.loader,
    "postcss-loader",
    sassData,
  ],
};

const sassCriticalLoader = {
  test: /(app).scss$/,
  use: [
    MiniCssExtractPlugin.loader,
    "css-loader",
    MediaQueryPlugin.loader,
    "postcss-loader",
    sassData,
  ],
};

const jceSassLoader = {
  test: /\.(scss)$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: "../",
      },
    },
    "css-loader",
    "postcss-loader",
    sassData,
  ],
};

const imageLoader = {
  test: /\.(gif|png|jpe?g|svg)$/i,
  type: "asset/resource",
  generator: {
    filename: "image/[contenthash][ext][query]",
  },
};

const fontLoader = {
  test: /\.(woff|woff2|eot|ttf|otf)$/,
  type: "asset/resource",
  generator: {
    filename: "fonts/[contenthash][ext][query]",
  },
};

const jsLoader = {
  test: /\.js$/,
  exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
  use: {
    loader: "babel-loader",
  },
};

const aliasData = {
  src: path.resolve(__dirname, "./src"),
};

const cssLoader = {
  test: /\.css$/i,
  use: ["style-loader", "css-loader"],
};

module.exports = {
  queryData,
  entryData,
  wwwDir,
  projectname,
  sassLoader,
  sassCriticalLoader,
  jceSassLoader,
  imageLoader,
  fontLoader,
  jsLoader,
  cssLoader,
  aliasData,
};
