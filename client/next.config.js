const withImages = require("next-images")
module.exports = withImages({
  webpack: (config, options) => {
    config.watchOptions.poll = 300
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|mp4)$/i,
      use: [
        {
          loader: "file-loader",
          options: {
            publicPath: "/_next",
            name: "static/media/[name].[hash].[ext]",
          },
        },
      ],
    })
    return config
  },
})
