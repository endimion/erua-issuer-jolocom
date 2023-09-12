const withCSS = require("@zeit/next-css");
const withPlugins = require("next-compose-plugins");
const withImages = require("next-images");
const webpack = require("webpack");
const path = require("path");
const constants = require("./utils/consts")

const imageConfig = withImages();

const rewrites = () => {
  return [
    {
      source: "/erua-issuer",
      destination: "/",
    },
  ];
};

module.exports = withPlugins([[withImages]], {
  webpack(config, options) {
    config.resolve.modules.push(path.resolve("./"));
    return config;
  },
  basePath: process.env.BASE_PATH?`/${process.env.BASE_PATH}`:"",
//   async rewrites() {
//     return rewrites();
//   },
});
