const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MediaQueryPlugin = require('aesirxio-template-library/media-query-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RealFaviconPlugin = require('aesirxio-template-library/real-favicon-webpack-plugin');
const HtmlWebpackSkipAssetsPlugin =
  require('html-webpack-skip-assets-plugin').HtmlWebpackSkipAssetsPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const FontPreloadPlugin = require('webpack-font-preload-plugin');
const { DefinePlugin } = require('webpack');

const {
  queryData,
  entryData,
  wwwDir,
  projectname,
  sassLoader,
  imageLoader,
  fontLoader,
  jsLoader,
  cssLoader,
  aliasData,
} = require('./webpack.common');

require('dotenv').config();

module.exports = (env, argv) => {
  if (env != undefined && env.deploy) {
    process.env = {
      wwwDir: wwwDir,
      projectname: projectname,
    };

    var templatePath = process.env.wwwDir;
  } else {
    var templatePath = process.env.wwwDir + '/' + process.env.projectname;
  }

  var config = {
    entry: entryData,
    plugins: [
      new DefinePlugin({
        process: { env: JSON.stringify(process.env) },
      }),
      new HtmlWebpackPlugin({
        inject: false,
        filename: templatePath + '/templates/' + process.env.projectname + '/index.php',
        template: './template/index.php',
        excludeAssets: [/.*./],
        realfavicons: true,
        minify: false,
      }),
      new HtmlWebpackPlugin({
        inject: false,
        filename: templatePath + '/templates/' + process.env.projectname + '/component.php',
        template: './template/component.php',
        chunks: ['views.component'],
        excludeAssets: [/.*./],
        minify: false,
      }),
      new HtmlWebpackPlugin({
        inject: false,
        filename: templatePath + '/templates/' + process.env.projectname + '/templateDetails.xml',
        template: './template/templateDetails.xml',
        templateParameters: process.env,
        minify: false,
      }),
      new HtmlWebpackPlugin({
        filename:
          templatePath +
          '/templates/' +
          process.env.projectname +
          '/html/layouts/oauth2/authorize.php',
        template: './template/html/layouts/oauth2/authorize.php',
        templateParameters: process.env,
        minify: false,
      }),
      new HtmlWebpackSkipAssetsPlugin(),
      new FileManagerPlugin({
        events: {
          onEnd: {
            copy: [
              {
                source: path.resolve(__dirname, './template/html/com_users'),
                destination:
                  templatePath + '/templates/' + process.env.projectname + '/html/com_users',
                options: {
                  force: true,
                },
              },

              {
                source: path.resolve(__dirname, './template/helper.php'),
                destination: templatePath + '/templates/' + process.env.projectname + '/helper.php',
              },
              {
                source: path.resolve(__dirname, './vendor'),
                destination: templatePath + '/templates/' + process.env.projectname + '/vendor',
              },
              {
                source: path.resolve(__dirname, './template/template_preview.png'),
                destination:
                  templatePath + '/templates/' + process.env.projectname + '/template_preview.png',
              },
              {
                source: path.resolve(__dirname, './template/template_thumbnail.png'),
                destination:
                  templatePath +
                  '/templates/' +
                  process.env.projectname +
                  '/template_thumbnail.png',
              },
            ],
          },
          onStart: {
            delete: [
              {
                source: templatePath + '/templates/' + process.env.projectname + '/html',
                options: {
                  force: true,
                },
              },
            ],
          },
        },
      }),
      new MediaQueryPlugin({
        include: true,
        queries: queryData,
        outputFileName: ({ path, queryname }) => {
          const pathParts = path
            .replace(__dirname + '/src/entry/', '')
            .replace(/\//g, '.')
            .replace('.scss', '');

          return `${pathParts}-${queryname}`;
        },
      }),
      new WebpackAssetsManifest({
        entrypoints: true,
        publicPath: '/templates/' + process.env.projectname + '/',
      }),
      new RemoveEmptyScriptsPlugin(),

      new FontPreloadPlugin({
        index: 'index.php',
        extensions: ['woff2'],
        replaceCallback: ({ indexSource, linksAsString }) => {
          return indexSource.replace('{{{fontPreload}}}', linksAsString);
        },
      }),
    ],
    output: {
      path: templatePath + '/templates/' + process.env.projectname + '/',
      publicPath: '/templates/' + process.env.projectname + '/',
    },
    module: {
      rules: [sassLoader, cssLoader, jsLoader, imageLoader, fontLoader],
    },
    optimization: {
      splitChunks: {
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },
    },
    resolve: {
      alias: aliasData,
    },
  };

  let name = '[name]';

  if (argv.mode === 'development') {
    config.devtool = 'source-map';

    if (env != undefined && env.deploy) {
      name = '[name].[contenthash]';
    }

    config.plugins.push(
      new BrowserSyncPlugin(
        // BrowserSync options
        {
          proxy: process.env.projectname + '.local',
          notify: true,
        }
      ),
      new MiniCssExtractPlugin({
        filename: 'css/' + name + '.css',
      })
    );
  }

  if (argv.mode === 'production') {
    name = '[name].[contenthash]';

    config.optimization.minimize = true;
    config.optimization.minimizer = [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ];

    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: 'css/' + name + '.css',
      }),
      new RealFaviconPlugin({
        favicon: path.resolve(__dirname, './src/favicon/favicon.png'),
        faviconJson: path.resolve(__dirname, './src/favicon/favicon.json'),
        publicPath: '/templates/' + process.env.projectname + '/favicon',
        outputPath: templatePath + '/templates/' + process.env.projectname + '/favicon',
      })
    );
  }

  config.output.filename = 'js/' + name + '.js';
  config.output.chunkFilename = 'js/' + name + '.js';

  return config;
};
