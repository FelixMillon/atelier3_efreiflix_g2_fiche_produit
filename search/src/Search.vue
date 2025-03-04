<template>
    <div class="search-container">
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
                    <div v-else-if="results.length === 0" class="py-2 text-center text-gray-400">
                        Aucun résultat trouvé
                    </div>
                    <div v-else class="max-h-60 overflow-y-auto">
                        <div v-for="result in results" :key="result.id"
                            class="p-2 hover:bg-gray-800 rounded cursor-pointer flex items-center"
                            @click="selectResult(result)">
                            <div class="w-8 h-12 bg-gray-700 mr-2 flex-shrink-0" v-if="result.posterUrl">
                                <img :src="result.posterUrl" alt="" class="w-full h-full object-cover" />
                            </div>
                            <div class="w-8 h-12 bg-gray-700 mr-2 flex-shrink-0" v-else></div>
                            <div>
                                <div class="text-sm font-medium">{{ result.title }}</div>
                                <div class="text-xs text-gray-400">{{ result.year }} • {{ result.genres.join(', ') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineEmits } from 'vue';

const searchTerm = ref('');
const results = ref([]);
const loading = ref(false);
const showResults = ref(false);
let debounceTimeout = null;

const emit = defineEmits(['search', 'resultSelected']);

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
        // Emit search event to parent component
        emit('search', searchTerm.value);
    }, 300);
}

function selectResult(result) {
    emit('resultSelected', result);
    showResults.value = false;
}

// Method to receive search results from parent
function setResults(searchResults) {
    results.value = searchResults;
    loading.value = false;
}

// Expose methods to parent component
defineExpose({
    setResults
});

// Close search results when clicking outside
function handleClickOutside(event) {
    if (!event.target.closest('.search-container')) {
        showResults.value = false;
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>