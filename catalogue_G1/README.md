# EfreiFlix Catalogue MFE

This is the Catalogue Micro Frontend for the EfreiFlix application.

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment to Vercel

This project is configured to be deployed to Vercel at https://mfe-g2-catalogue.vercel.app/

To deploy:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Configure the project with the following settings:
   - Framework Preset: Other
   - Build Command: npm run build
   - Output Directory: dist
   - Install Command: npm install

## Exposed Module

This MFE exposes the following module:
- `./Catalogue`: The main catalogue component

## Remote Modules

This MFE consumes the following remote modules:
- `preview`: Product preview component from another MFE 