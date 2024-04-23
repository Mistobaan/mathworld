/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')(['@duckdb/react-duckdb', "xterm"]);
const CopyWebpackPlugin = require('copy-webpack-plugin')

const nextConfig = withTM({
  output: 'export',
  basePath: "/mathworld",
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config, { isServer, dev }) {
    config.output.webassemblyModuleFilename = isServer && !dev ? '..static/wasm/[name].[moduleHash].wasm' : 'static/wasm/[name].[moduleHash].wasm'
    config.experiments = { ...config.experiments, asyncWebAssembly: true }

    config.module.rules.push({
      test: /.*\.wasm$/,
      type: "asset/resource",
      generator: {
        filename: "static/wasm/[name].[contenthash][ext]",
      },
    });
    // config.module.rules.push({
    //   test: /.*\.feather$/,
    //   type: "asset/resource",
    //   generator: {
    //     filename: "static/dataset/[name].[contenthash][ext]",
    //   },
    // })
    config.plugins = [
      ...config.plugins,
      new CopyWebpackPlugin({
        patterns: [
          { from: "./deepscatter-tiles", to: "./static/tiles" },
        ],
      }), 
    ];

    return config;
  }

})

module.exports = nextConfig
