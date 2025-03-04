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
  const root = createRoot(el);
  root.render(<App />);
  return root;
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