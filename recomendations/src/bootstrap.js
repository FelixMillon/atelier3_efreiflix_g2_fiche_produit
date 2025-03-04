import React from "react";
import { createRoot } from "react-dom/client";
import Recommendations from "./recommendations";
import data from "../../db/efreiflix-db.json";

const mount = (el) => {
  const root = createRoot(el);

  root.render(
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen p-8">
      {data.recommendations.map((rec) => (
        <div key={rec.movieId} className="mb-12">
          <Recommendations
            movieId={rec.movieId}
            movies={data.movies}
            recommendations={data.recommendations}
          />
        </div>
      ))}
    </div>
  );

  return root;
};

// Si on est en développement et en mode isolation, on monte immédiatement
if (process.env.NODE_ENV === "development") {
  const devRoot = document.querySelector("#root");
  if (devRoot) {
    mount(devRoot);
  }
}

// Exportation pour le shell
export { mount };
