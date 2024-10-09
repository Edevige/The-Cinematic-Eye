<template>
    <!-- Barra per applicare i filtri -->
    <div class="d-flex justify-content-around bg-secondary text-white p-3">
      <div class="form_group">
        <label>Genere</label>
        <select v-model="searchParams.genreId">
          <option value="">Qualsiasi genere</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">{{ genre.name }}</option>
        </select>
      </div>
  
      <div class="form_group">
        <label>Anno di Rilascio:</label>
        <input type="number" v-model="searchParams.releaseYear" min="1890" :max="new Date().getFullYear()">
      </div>
  
      <div class="form_group">
        <label>Durata Minima (in minuti):</label>
        <input type="number" v-model="searchParams.minRuntime" min="1">
      </div>
  
      <div class="form_group">
        <label>Durata Massima (in minuti):</label>
        <input type="number" v-model="searchParams.maxRuntime" min="1">
      </div>
  
      <div class="form_group position-relative">
        <label>Regista:</label>
        <input type="text" v-model="searchParams.directorQuery" @input="fetchDirectorSuggestions" autocomplete="off">
        <!-- Suggerimenti regista -->
        <ul v-if="directorSuggestions.length" class="list-group position-absolute">
          <li v-for="director in directorSuggestions" :key="director.id" @click="selectDirector(director)" class="list-group-item list-group-item-action">
            {{ director.name }}
          </li>
        </ul>
      </div>
  
      <div class="form_group position-relative">
        <label>Cast:</label>
        <input type="text" v-model="searchParams.castQuery" @input="fetchCastSuggestions" autocomplete="off">
        <!-- Suggerimenti cast -->
        <ul v-if="castSuggestions.length" class="list-group position-absolute">
          <li v-for="actor in castSuggestions" :key="actor.id" @click="selectCast(actor)" class="list-group-item list-group-item-action">
            {{ actor.name }}
          </li>
        </ul>
      </div>
  
      <div class="form-group">
        <label>Valutazione Minima (0 a 10):</label>
        <input type="number" v-model.number="searchParams.minRating" min="0" max="10" step="0.5">
      </div>
  
      <div class="form-group">
        <label>Valutazione Massima (0 a 10):</label>
        <input type="number" v-model.number="searchParams.maxRating" min="0" max="10" step="0.5">
      </div>
  
      <div>
        <button @click="clearFilters" class="btn btn-danger">Rimuovi tutti i filtri</button>
      </div>
    </div>
  
    <!-- Filtri selezionati -->
    <div class="bg-light text-dark p-2">
      <span v-if="activeFilters.length > 0">Filtri attivi:</span>
      <span v-for="filter in activeFilters" :key="filter" class="badge bg-info text-dark mx-1">
        {{ filter }} <button @click="removeFilter(filter)" class="btn-close btn-close-white"></button>
      </span>
    </div>
  
    <!-- Lista dei film trovati -->
    <div class="d-flex flex-column">
      <div v-for="item in filmFound" :key="item.id" class="d-flex flex-row">
        <router-link :to="'/film/'+item.id" class="d-flex flex-row" style="appearance: none !important; text-decoration: none;">
          <div class="col-1">
            <img v-if="item.poster_path" class="img img-fluid w-auto mt-4" :src="imgUrl + item.poster_path" />
            <img v-else class="img img-fluid w-auto mt-4" src="https://placehold.co/200x300?text=No\nposter" />
          </div>
          <div class="col d-flex align-items-center text-white">
            <div class="h4 m-4">{{ item.original_title }}</div>
          </div>
        </router-link>
      </div>
    </div>
  </template>
  
  
  <script>
  import TMdbApi from '@/services/TMdbApi';
  
  export default {
    data() {
      return {
        searchParams: {
          genreId: '',
          releaseYear: '',
          minRating: '',    // Valutazione minima
          maxRating: '',    // Valutazione massima
          minRuntime: '',   // Durata minima
          maxRuntime: '',   // Durata massima
          directorQuery: '',  // Input per il regista
          directorId: '',     // ID del regista selezionato
          castQuery: '',      // Input per il cast
          castIds: [],        // ID del cast selezionato
        },
        filmFound: [],
        imgUrl: "https://image.tmdb.org/t/p/original",
        genres: [], // Generi caricati dall'API
        directorSuggestions: [],  // Risultati del suggerimento per regista
        castSuggestions: [],      // Risultati del suggerimento per cast
      };
    },
  
    computed: {
      activeFilters() {
        const filters = [];
        if (this.searchParams.genreId) filters.push(`Genere: ${this.getGenreNameById(this.searchParams.genreId)}`);
        if (this.searchParams.releaseYear) filters.push(`Anno di Rilascio: ${this.searchParams.releaseYear}`);
        if (this.searchParams.minRuntime) filters.push(`Durata Minima: ${this.searchParams.minRuntime} min`);
        if (this.searchParams.maxRuntime) filters.push(`Durata Massima: ${this.searchParams.maxRuntime} min`);
        if (this.searchParams.directorId) filters.push(`Regista: ${this.getDirectorNameById(this.searchParams.directorId)}`);
        if (this.searchParams.castIds.length) filters.push(`Cast: ${this.searchParams.castIds.length} attori`);
        if (this.searchParams.minRating) filters.push(`Valutazione Minima: ${this.searchParams.minRating}`);
        if (this.searchParams.maxRating) filters.push(`Valutazione Massima: ${this.searchParams.maxRating}`);
        return filters;
      },
    },
  
    methods: {
      async fetchFilm() {
        try {
          const response = await TMdbApi().get('discover/movie', {
            params: {
              sort_by: 'popularity.desc',
              with_genres: this.searchParams.genreId || undefined,
              primary_release_year: this.searchParams.releaseYear || undefined,
              'vote_average.gte': this.searchParams.minRating || undefined, // Valutazione minima
              'vote_average.lte': this.searchParams.maxRating || undefined, // Valutazione massima
              'with_runtime.gte': this.searchParams.minRuntime || undefined, // Durata minima
              'with_runtime.lte': this.searchParams.maxRuntime || undefined, // Durata massima
              with_cast: this.searchParams.castIds.length ? this.searchParams.castIds.join(',') : undefined,
              with_crew: this.searchParams.directorId || undefined,
            },
          });
          this.filmFound = response.data.results;
        } catch (error) {
          console.error(error);
        }
      },
  
      // Autocompletamento per il regista
      async fetchDirectorSuggestions() {
        if (this.searchParams.directorQuery.length > 2) {
          try {
            const response = await TMdbApi().get('search/person', {
              params: { query: this.searchParams.directorQuery }
            });
            this.directorSuggestions = response.data.results.filter(person => person.known_for_department === 'Directing');
          } catch (error) {
            console.error(error);
          }
        } else {
          this.directorSuggestions = [];
        }
      },
      async fetchGenres() {
      try {
        const response = await TMdbApi().get('genre/movie/list');
        this.genres = response.data.genres;
      } catch (error) {
        console.error('Errore in fetchGenres:', error);
      }
    },
  
      // Autocompletamento per il cast
      async fetchCastSuggestions() {
        if (this.searchParams.castQuery.length > 2) {
          try {
            const response = await TMdbApi().get('search/person', {
              params: { query: this.searchParams.castQuery }
            });
            this.castSuggestions = response.data.results.filter(person => person.known_for_department === 'Acting');
          } catch (error) {
            console.error(error);
          }
        } else {
          this.castSuggestions = [];
        }
      },
  
      // Seleziona un regista dai suggerimenti
      selectDirector(director) {
        this.searchParams.directorQuery = director.name;
        this.searchParams.directorId = director.id;
        this.directorSuggestions = [];
      },
  
      // Seleziona un attore dai suggerimenti
      selectCast(actor) {
        this.searchParams.castQuery = '';
        this.searchParams.castIds.push(actor.id);
        this.castSuggestions = [];
      },
  
      // Funzione per ottenere il nome del genere in base all'ID
      getGenreNameById(id) {
        const genre = this.genres.find((g) => g.id === id);
        return genre ? genre.name : '';
      },
  
      // Funzione per ottenere il nome del regista in base all'ID
      getDirectorNameById(id) {
        return this.searchParams.directorQuery;
      },
  
      clearFilters() {
        this.searchParams = {
          genreId: '',
          releaseYear: '',
          minRating: '',
          maxRating: '',
          minRuntime: '',
          maxRuntime: '',
          directorQuery: '',
          directorId: '',
          castQuery: '',
          castIds: [],
        };
      },
  
      removeFilter(filter) {
        if (filter.startsWith('Genere:')) this.searchParams.genreId = '';
        if (filter.startsWith('Anno di Rilascio:')) this.searchParams.releaseYear = '';
        if (filter.startsWith('Durata Minima:')) this.searchParams.minRuntime = '';
        if (filter.startsWith('Durata Massima:')) this.searchParams.maxRuntime = '';
        if (filter.startsWith('Regista:')) this.searchParams.directorId = '';
        if (filter.startsWith('Cast:')) this.searchParams.castIds = [];
        if (filter.startsWith('Valutazione Minima:')) this.searchParams.minRating = '';
        if (filter.startsWith('Valutazione Massima:')) this.searchParams.maxRating = '';
      },
    },
  
    watch: {
      searchParams: {
        handler() {
          this.fetchFilm();
        },
        deep: true,
      },
    },
  
    mounted() {
      this.fetchFilm();
      this.fetchGenres();
    },
  };
  </script>
  