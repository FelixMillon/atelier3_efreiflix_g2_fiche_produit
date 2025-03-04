const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      }
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        // Updated remote URLs to use Vercel deployments
        // Use the deployed URLs when available, otherwise fallback to localhost for development
        catalogue_G1: process.env.NODE_ENV === 'production' 
          ? 'catalogue_G1@https://mfe-g2-catalogue.vercel.app/remoteEntry.js'
          : 'catalogue_G1@http://localhost:3003/remoteEntry.js',
        recommendations: process.env.NODE_ENV === 'production'
          ? 'recommendations@https://mfe-g2-recommendations.vercel.app/remoteEntry.js'
          : 'recommendations@http://localhost:3055/remoteEntry.js',
        watchlist: process.env.NODE_ENV === 'production'
          ? 'watchlist@https://mfe-g2-watchlist.vercel.app/watchlist_chunk.js'
          : 'watchlist@http://localhost:3031/watchlist_chunk.js',
        notation: process.env.NODE_ENV === 'production'
          ? 'notation@https://mfe-g2-notation.vercel.app/Notation.js'
          : 'notation@http://localhost:3032/Notation.js',
        preview: process.env.NODE_ENV === 'production'
          ? 'preview@https://mfe-g2-product-fiche.vercel.app/productPreview.js'
          : 'preview@http://localhost:3033/productPreview.js',
        comments: process.env.NODE_ENV === 'production'
          ? 'comments@https://mfe-g2-comments.vercel.app/Comments.js'
          : 'comments@http://localhost:3025/Comments.js',
        userprofile: process.env.NODE_ENV === 'production'
          ? 'userProfile@https://mfe-g2-userprofile.vercel.app/userProfile.js'
          : 'userProfile@http://localhost:3034/userProfile.js',
        favoris: process.env.NODE_ENV === 'production'
          ? 'favoris@https://mfe-g2-favoris.vercel.app/remoteEntry.js'
          : 'favoris@http://localhost:3010/remoteEntry.js'
        // We're removing the example MFEs (header and skeleton)
        // header: 'header@http://localhost:3001/remoteEntry.js',
        // skeleton: 'skeleton@http://localhost:3002/remoteEntry.js',
        catalogue_G1: 'catalogue_G1@http://localhost:3003/remoteEntry.js',
        recommendations: 'recommendations@http://localhost:3055/remoteEntry.js',
        watchlist: 'watchlist@http://localhost:3031/watchlist_chunk.js',
        notation: 'notation@http://localhost:3032/Notation.js',
        preview: 'preview@http://localhost:3033/productPreview.js',
        comments: 'comments@http://localhost:3025/Comments.js',
        userprofile: 'userProfile@http://localhost:3034/userProfile.js',
        favoris: 'favoris@http://localhost:3010/remoteEntry.js',
        // Déclaration du micro-frontend Header
        // Format: "nom_remote@url/fichier_entree.js"
        menu_G1: 'menu_G1@http://localhost:3004/remoteEntry.js',
      },

      shared: {
        react: {
          singleton: true,
          requiredVersion: false,
          eager: true
        },
        "react-dom": {
          singleton: true,
          requiredVersion: false,
          eager: true
        }
      },
    }),
    // Génération du HTML avec le point d'entrée
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[id].js',
  },
}; 