/**
 * Configuration Webpack pour l'application Shell (Host Application)
 * 
 * Ce fichier configure l'application principale qui va héberger et orchestrer
 * les différents micro-frontends. En tant qu'application hôte, elle est responsable
 * de l'importation et de l'intégration des composants distants.
 * 
 * Points clés :
 * - Configuration du port de développement (3000)
 * - Déclaration des micro-frontends distants (remotes)
 * - Configuration du partage des dépendances
 * - Configuration de Babel pour la transpilation React
 */

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devServer: {
    port: 3000, // Port distinct du micro-frontend Header (3001)
    hot: true,  // Activation du Hot Module Replacement
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"], // Configuration Babel pour React
        },
      },
    ],
  },
  plugins: [
    // Configuration Module Federation pour l'application hôte
    new ModuleFederationPlugin({
      name: "shell", // Nom unique de l'application
      remotes: {
        // Déclaration du micro-frontend Header
        // Format: "nom_remote@url/fichier_entree.js"
        header: 'header@http://localhost:3001/remoteEntry.js', // Configuration pour consommer le MFE 'header'
        skeleton: 'skeleton@http://localhost:3002/remoteEntry.js',
        catalogue_G1: 'catalogue_G1@http://localhost:3003/remoteEntry.js',
        menu_G1: 'menu_G1@http://localhost:3004/remoteEntry.js',
      },

      shared: {
        // Configuration du partage des dépendances
        react: { 
          singleton: true,     // Une seule instance de React
          requiredVersion: false, // Pas de vérification stricte des versions
          eager: true         // Chargement immédiat pour l'app host
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
}; 