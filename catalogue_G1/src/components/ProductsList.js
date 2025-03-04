import React, { useState, useEffect } from "react";
import Product from "./Product";
import './styles.css';

// Use dynamic import for the MovieCard component from the remote module
// The import path should match the remote name in the webpack config
const MovieCard = React.lazy(() => import("preview/productPreview"));

export const ProductsList = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (id) => {
    setSelectedProduct(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  return (
    <div className="flex gap-3">
      {products.map((product) => (
        <a
          className="cursor-pointer"
          key={product.id}
          onClick={(e) => {
            handleProductClick(product.id);
          }}
        >
          <Product product={product} />
        </a>
      ))}

      {isModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative w-full max-w-2xl mx-auto" onClick={(e) => e.stopPropagation()}>
            <React.Suspense fallback={<div className="text-white text-center p-8">Chargement...</div>}>
              <MovieCard id={selectedProduct} />
            </React.Suspense>
            <button
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full z-10"
              onClick={closeModal}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
