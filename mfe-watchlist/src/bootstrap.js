import React from 'react';
import { createRoot } from 'react-dom/client';
import Watchlist from './Watchlist';

const mount = (el) => {
  const root = createRoot(el);
  root.render(<Watchlist />);
  return root;
};

// If we are in development and running in isolation,
// mount immediately
if (process.env.NODE_ENV === 'development') {
  const devRoot = document.querySelector('#root');
  if (devRoot) {
    mount(devRoot);
  }
}

// We are running through the shell
export { mount }; 