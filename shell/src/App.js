import React, { Suspense, useEffect } from 'react';

// Remove header import
// const Header = React.lazy(() => import('header/Header'));
// We'll use the real MFEs instead of the skeleton
// const Skeleton = React.lazy(() => import('skeleton/Skeleton'));
const Catalogue = React.lazy(() => import('catalogue_G1/Catalogue'));
const Recommendations = React.lazy(() => import('recommendations/recommendations'));
const Watchlist = React.lazy(() => import('watchlist/Watchlist'));
const Notation = React.lazy(() => import('notation/Notation'));
const Preview = React.lazy(() => import('preview/productPreview'));
const UserProfile = React.lazy(() => import('userprofile/userProfile')); 
const Favoris = React.lazy(() => import('favoris/Watchlist'));

// Error boundary component for handling loading errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("MFE loading error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 bg-red-900 rounded">
        {this.props.fallback || "Une erreur est survenue lors du chargement du composant."}
      </div>;
    }

    return this.props.children;
  }
}

// Loading placeholder component
const LoadingPlaceholder = ({ text }) => (
  <div>
    <div className="flex gap-4 overflow-x-auto py-5">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="min-w-[200px] h-[300px] bg-gray-800 rounded"></div>
      ))}
    </div>
    <div className="text-center mt-4">{text || 'Chargement...'}</div>
  </div>
);

const App = () => {
  const [activeSection, setActiveSection] = React.useState('home');

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify({ id: 1, profileId: 1 }));
  }, []);

  return (
    <div className="bg-[#141414] text-white min-h-screen font-sans">
      {/* Netflix-like header */}
      <header className="bg-black/80 px-8 py-4 flex items-center sticky top-0 z-50 shadow-md">
        <div className="text-[#E50914] font-bold text-3xl">
          EFREIFlix
        </div>
        <nav className="ml-auto">
          <ul className="flex gap-6 list-none m-0 p-0">
            <li 
              className={`cursor-pointer ${activeSection === 'home' ? 'font-bold' : 'font-normal'}`}
              onClick={() => setActiveSection('home')}
            >
              Accueil
            </li>
            <li 
              className={`cursor-pointer ${activeSection === 'films' ? 'font-bold' : 'font-normal'}`}
              onClick={() => setActiveSection('films')}
            >
              Films
            </li>
            <li 
              className={`cursor-pointer ${activeSection === 'series' ? 'font-bold' : 'font-normal'}`}
              onClick={() => setActiveSection('series')}
            >
              Séries
            </li>
            <li 
              className={`cursor-pointer ${activeSection === 'recommendations' ? 'font-bold' : 'font-normal'}`}
              onClick={() => setActiveSection('recommendations')}
            >
              Recommandations
            </li>
            <li 
              className={`cursor-pointer ${activeSection === 'watchlist' ? 'font-bold' : 'font-normal'}`}
              onClick={() => setActiveSection('watchlist')}
            >
              Ma Liste
            </li>
            <li 
              className={`cursor-pointer ${activeSection === 'favorites' ? 'font-bold' : 'font-normal'}`}
              onClick={() => setActiveSection('favorites')}
            >
              Favoris
            </li>
            <li 
              className="cursor-pointer"
              style={{ 
                fontWeight: activeSection === 'userProfile' ? 'bold' : 'normal'
              }}
              onClick={() => setActiveSection('userProfile')}
            >
              Mon Profile
            </li>
          </ul>
        </nav>
      </header>

      <main className="p-8">
        {/* Hero banner section - only show on home */}
        {activeSection === 'home' && (
          <section className="mb-12 relative h-[400px] rounded-lg overflow-hidden bg-gradient-to-b from-black/10 to-[#141414] bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/c31c3123-3df7-4359-8b8c-475bd2d9925d/15feb590-3d73-45e9-9e4a-2eb334c33cbb/FR-en-20231225-popsignuptwoweeks-perspective_alpha_website_large.jpg')] bg-cover bg-center flex flex-col justify-end p-8">
            <h1 className="text-5xl m-0 mb-4">Bienvenue sur EFREIFlix</h1>
            <p className="text-xl max-w-[600px] mb-6">
              Découvrez notre sélection de films et séries. Notez vos favoris et ajoutez-les à votre liste personnalisée.
            </p>
          </section>
        )}

        {/* Main content area with catalogue - show on home or films */}
        {(activeSection === 'home' || activeSection === 'films') && (
          <section className="mb-12">
            <h2 className="text-2xl mb-6">Catalogue</h2>
            <ErrorBoundary fallback="Erreur lors du chargement du catalogue.">
              <Suspense fallback={<LoadingPlaceholder text="Chargement du catalogue..." />}>
                <Catalogue />
              </Suspense>
            </ErrorBoundary>
          </section>
        )}

        {/* Recommendations section - show on home or recommendations */}
        {(activeSection === 'home' || activeSection === 'recommendations') && (
          <section className="mb-12">
            <h2 className="text-2xl mb-6">Recommandations</h2>
            <ErrorBoundary fallback="Erreur lors du chargement des recommandations.">
              <Suspense fallback={<LoadingPlaceholder text="Chargement des recommandations..." />}>
                <Recommendations 
                  movieId={1}
                  movies={[
                    { id: 1, title: "Inception" },
                    { id: 2, title: "The Dark Knight" },
                    { id: 3, title: "Interstellar" },
                    { id: 4, title: "The Matrix" },
                    { id: 5, title: "Pulp Fiction" }
                  ]}
                  recommendations={[
                    { 
                      movieId: 1, 
                      recommendedMovieIds: [2, 3, 4, 5] 
                    }
                  ]}
                />
              </Suspense>
            </ErrorBoundary>
          </section>
        )}

        {/* Watchlist section - show on home or watchlist */}
        {(activeSection === 'home' || activeSection === 'watchlist') && (
          <section className="mb-12">
            <h2 className="text-2xl mb-6">Ma Liste</h2>
            <ErrorBoundary fallback="Erreur lors du chargement de la watchlist.">
              <Suspense fallback={<LoadingPlaceholder text="Chargement de la watchlist..." />}>
                <Watchlist />
              </Suspense>
            </ErrorBoundary>
          </section>
        )}

        {/* Favorites section - show on home or favorites */}
        {(activeSection === 'home' || activeSection === 'favorites') && (
          <section className="mb-12">
            <h2 className="text-2xl mb-6">Favoris</h2>
            <ErrorBoundary fallback="Erreur lors du chargement des favoris.">
              <Suspense fallback={<LoadingPlaceholder text="Chargement des favoris..." />}>
                <Favoris />
              </Suspense>
            </ErrorBoundary>
          </section>
        )}

        {/* Notation section - show on home */}
        {activeSection === 'home' && (
          <section className="mb-12">
            <h2 className="text-2xl mb-6">Notations</h2>
            <ErrorBoundary fallback="Erreur lors du chargement des notations.">
              <Suspense fallback={<LoadingPlaceholder text="Chargement des notations..." />}>
                <Notation movieId={1} />
              </Suspense>
            </ErrorBoundary>
          </section>
        )}

        {/* UserProfile section - show on home */}
        {activeSection == 'userProfile' && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Profile Utilisateur</h2>
            <ErrorBoundary fallback="Erreur lors du chargement du profile.">
              <Suspense fallback={<LoadingPlaceholder text="Chargement du profile..." />}>
                <UserProfile/>
              </Suspense>
            </ErrorBoundary>
          </section>
        )}
      </main>

      {/* Netflix-like footer */}
      <footer className="p-8 bg-black/80 text-gray-400 text-sm">
        <div className="max-w-7xl mx-auto">
          <p>© 2023 EFREIFlix. Tous droits réservés.</p>
          <div className="flex gap-8 mt-4">
            <div>Conditions d'utilisation</div>
            <div>Confidentialité</div>
            <div>Aide</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;