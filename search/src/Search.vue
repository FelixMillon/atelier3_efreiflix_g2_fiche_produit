<template>
    <div class="search-container" ref="searchContainerRef">
        <div class="relative">
            <input type="search" class="search-input w-full" placeholder="Rechercher un film, une série..."
                v-model="searchTerm" @input="handleInput" />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
            </div>

            <div v-if="showResults && searchTerm.length >= 3"
                class="absolute mt-1 w-full bg-netflix-dark border border-gray-700 rounded-md shadow-lg z-10">
                <div class="p-2">
                    <div v-if="loading" class="text-center py-2">
                        <span
                            class="inline-block animate-spin h-4 w-4 border-2 border-netflix-red border-r-transparent rounded-full mr-2"></span>
                        Recherche...
                    </div>
                    <div v-else-if="processedResults.length === 0" class="py-2 text-center text-gray-400">
                        Aucun résultat trouvé
                    </div>
                    <div v-else class="max-h-60 overflow-y-auto">
                        <div v-for="result in processedResults" :key="result.id"
                            class="p-2 hover:bg-gray-800 rounded cursor-pointer flex items-center"
                            @click="selectResult(result)">
                            <div class="w-8 h-12 bg-gray-700 mr-2 flex-shrink-0" v-if="result.posterUrl">
                                <img :src="result.posterUrl" alt="" class="w-full h-full object-cover" />
                            </div>
                            <div class="w-8 h-12 bg-gray-700 mr-2 flex-shrink-0" v-else></div>
                            <div>
                                <div class="text-sm font-medium">{{ result.title }}</div>
                                <div class="text-xs text-gray-400">{{ result.year }} • {{ result.genres.join(', ') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineEmits, computed, watch } from 'vue';
import axios from 'axios';

const searchContainerRef = ref(null);
const searchTerm = ref('');
const results = ref([]);
const loading = ref(false);
const showResults = ref(false);
let debounceTimeout = null;

// API key pour TMDb
const apiKey = '15d2ea6d0dc1d476efbca3eba2b9bbfb';

const emit = defineEmits(['search', 'resultSelected']);

// Traitement des résultats pour les adapter au format attendu par le template
const processedResults = computed(() => {
    // Si results est vide ou non défini
    if (!results.value || results.value.length === 0) {
        return [];
    }
    
    // Si les données sont déjà dans le format attendu, on les utilise directement
    return results.value.map(movie => {
        // Pour le posterUrl, on s'assure qu'il est bien formaté
        const posterUrl = movie.posterUrl && !movie.posterUrl.startsWith('http')
            ? `http://localhost:3001${movie.posterUrl}`  // Ajuster selon votre configuration
            : movie.posterUrl;
            
        return {
            id: movie.id,
            title: movie.title,
            year: movie.year,
            genres: Array.isArray(movie.genres) ? movie.genres : [movie.genres],
            overview: movie.description,
            posterUrl: posterUrl,
            trailerUrl: movie.trailerUrl,
            rating: movie.rating
        };
    });
});

function handleInput() {
    showResults.value = true;

    // Clear previous timeout
    if (debounceTimeout) {
        clearTimeout(debounceTimeout);
    }

    // Reset results if less than 3 characters
    if (searchTerm.value.length < 3) {
        results.value = [];
        loading.value = false;
        return;
    }

    // Set loading state
    loading.value = true;

    // Debounce search
    debounceTimeout = setTimeout(() => {
        console.log("Recherche:", searchTerm.value);

        // Utiliser la référence directe au lieu de querySelector
        if (searchContainerRef.value) {
            const searchEvent = new CustomEvent('search', {
                detail: searchTerm.value,
                bubbles: true,
                composed: true
            });
            searchContainerRef.value.dispatchEvent(searchEvent);
        }
    }, 300);
}

function selectResult(result) {
    emit('resultSelected', result);
    showResults.value = false;
}

// Fonction pour récupérer les posters de films depuis TMDb
async function fetchMoviePosters(movies) {
    if (!movies || movies.length === 0) return movies;
    
    console.log("Fetching movie posters for", movies.length, "movies");
    
    const moviesWithPosters = await Promise.all(movies.map(async (movie) => {
        try {
            // Vérifier si on a déjà un poster valide
            if (movie.posterUrl && movie.posterUrl.includes('tmdb.org')) {
                return movie;
            }
            
            const response = await axios.get(
                `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movie.title)}`
            );
            
            const posterPath = response.data.results[0]?.poster_path;
            const tmdbPosterUrl = posterPath ? `http://image.tmdb.org/t/p/w500${posterPath}` : null;
            
            return {
                ...movie,
                posterUrl: tmdbPosterUrl || movie.posterUrl // Utiliser l'URL TMDb si disponible, sinon conserver l'URL existante
            };
        } catch (error) {
            console.error(`Erreur lors de la récupération du poster pour ${movie.title}:`, error);
            return movie; // Retourner le film sans modifier son poster en cas d'erreur
        }
    }));
    
    console.log("Fetched posters successfully");
    return moviesWithPosters;
}

// Method to receive search results from parent
async function setResults(searchResults) {
    console.log("Received search results in setResults:", searchResults);
    
    // Récupérer les posters pour les résultats
    const resultsWithPosters = await fetchMoviePosters(searchResults);
    
    results.value = resultsWithPosters;
    loading.value = false;
}

// Expose methods to parent component
defineExpose({
    setResults
});

// Define named function for event listener
async function handleSearchResults(event) {
    console.log("Received search results via custom event:", event.detail);
    await setResults(event.detail);
}

// Close search results when clicking outside
function handleClickOutside(event) {
    if (!event.target.closest('.search-container')) {
        showResults.value = false;
    }
}

onMounted(() => {
    console.log("Component mounted");
    document.addEventListener('click', handleClickOutside);
    
    // Use a named function so we can remove it properly later
    window.addEventListener('searchResults', handleSearchResults);
});

onBeforeUnmount(() => {
    console.log("Component will unmount");
    document.removeEventListener('click', handleClickOutside);
    
    // Remove event listener with same function reference
    window.removeEventListener('searchResults', handleSearchResults);
});
</script>

<style scoped>
.search-input {
    @apply bg-netflix-dark border border-gray-700 text-white px-4 py-2 rounded-md transition-all duration-300;
}

.search-input:focus {
    @apply border-netflix-red outline-none ring-1 ring-netflix-red;
}
</style>