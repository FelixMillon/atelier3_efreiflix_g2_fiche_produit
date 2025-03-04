/**
 * Bootstrap de l'application Shell
 * 
 * Ce fichier est crucial pour Module Federation car il gère l'initialisation
 * asynchrone de l'application. Cette approche est nécessaire pour :
 * 1. Assurer le chargement correct des dépendances partagées
 * 2. Éviter les problèmes de chargement des modules fédérés
 * 3. Permettre une initialisation propre de React
 * 
 * Note: Ce fichier est chargé de manière asynchrone par index.js
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// Mount function to start up the app
const mount = (el) => {
  try {
    const root = createRoot(el);
    
    // Add error handling for rendering
    try {
      root.render(<App />);
    } catch (error) {
      console.error('Error rendering the application:', error);
      root.render(
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#E50914', 
          color: 'white',
          borderRadius: '8px',
          margin: '20px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h2>Une erreur est survenue</h2>
          <p>Impossible de charger l'application EFREIFlix. Veuillez réessayer plus tard.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: 'white',
              color: '#E50914',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
              fontWeight: 'bold'
            }}
          >
            Rafraîchir la page
          </button>
        </div>
      );
    }
    
    return root;
  } catch (error) {
    console.error('Fatal error mounting the application:', error);
    // Display a basic error message if createRoot fails
    el.innerHTML = `
      <div style="padding: 20px; background-color: #E50914; color: white; border-radius: 8px; margin: 20px; font-family: Arial, sans-serif">
        <h2>Erreur critique</h2>
        <p>Impossible d'initialiser l'application EFREIFlix.</p>
        <button 
          onclick="window.location.reload()"
          style="background-color: white; color: #E50914; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px; font-weight: bold"
        >
          Rafraîchir la page
        </button>
      </div>
    `;
    return null;
  }
};

// If we are in development and in isolation,
// call mount immediately
if (process.env.NODE_ENV === 'development') {
  const devRoot = document.querySelector('#root');

  if (devRoot) {
    mount(devRoot);
  }
}

// We are running through container
// and we should export the mount function
export { mount }; 