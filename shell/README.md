# EFREIFlix Shell Application

This is the shell application for the EFREIFlix micro-frontend architecture. It serves as the container for all the micro-frontends that make up the EFREIFlix application.

## Deployed URL

The shell application is deployed at: [https://mfe-g2-shell.vercel.app/](https://mfe-g2-shell.vercel.app/)

## Micro-Frontend Architecture

This shell application uses Webpack Module Federation to load the following micro-frontends:

- Catalogue (G1): [https://mfe-g1-catalogue.vercel.app/](https://mfe-g1-catalogue.vercel.app/)
- Recommendations: [https://mfe-g2-recommendations.vercel.app/](https://mfe-g2-recommendations.vercel.app/)
- Watchlist: [https://mfe-g2-watchlist.vercel.app/](https://mfe-g2-watchlist.vercel.app/)
- Notation: [https://mfe-g2-notation.vercel.app/](https://mfe-g2-notation.vercel.app/)
- Product Preview: [https://mfe-g2-product-fiche.vercel.app/](https://mfe-g2-product-fiche.vercel.app/)
- Comments: [https://mfe-g2-comments.vercel.app/](https://mfe-g2-comments.vercel.app/)
- User Profile: [https://mfe-g2-userprofile.vercel.app/](https://mfe-g2-userprofile.vercel.app/)
- Favoris: [https://mfe-g2-favoris.vercel.app/](https://mfe-g2-favoris.vercel.app/)

## Development

To run the application locally:

```bash
npm install
npm start
```

This will start the development server at http://localhost:3000.

## Building for Production

To build the application for production:

```bash
npm run build
```

This will create a `dist` directory with the production build.

## Deployment to Vercel

The application is configured to be deployed to Vercel. The `vercel.json` file contains the configuration for the deployment.

### Deployment Steps

1. Make sure you have the Vercel CLI installed:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the application:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

### Vercel Configuration

The `vercel.json` file contains the following configuration:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "X-Requested-With, Content-Type, Accept"
        }
      ]
    }
  ]
}
```

This configuration:
- Sets up rewrites to handle client-side routing
- Specifies the build command and output directory
- Adds CORS headers to allow the micro-frontends to communicate with each other

## Troubleshooting

If you encounter issues with the micro-frontends not loading:

1. Check the browser console for errors
2. Verify that the micro-frontend URLs in `webpack.config.js` are correct
3. Ensure that the micro-frontends are properly exposing their modules
4. Check that CORS headers are properly configured 