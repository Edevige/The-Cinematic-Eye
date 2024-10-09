<template>
    <div>
      <div class="m-2 carousel-container">
        <!-- Trasforma il titolo in un link cliccabile che porta alla pagina della lista -->
        <router-link :to="'/lista/' + listId">
          <p class="h1 p-2">{{ title }}</p>
        </router-link>
  
        <div class="position-relative ">
          <div class="row w-100 mx-auto">
            <!-- Controllo se ci sono film attivi prima di iterare -->
            <div v-if="activeFilm.length" v-for="(item, index) in activeFilm" :key="index" class="col-12 col-sm-6 col-md-4 col-lg-3 position-relative">
              <!-- Assicurati che item esista -->
              <router-link v-if="item" :to="'/film/' + item.id">
                <img :src="imgUrl + item.backdrop_path" class="img-fluid mx-auto d-block" :alt="index">
              </router-link>
              <div v-if="item" class="film-info">
                <a class="h6 p-2">{{ item.original_title }}</a>
              </div>
            </div>
            <div v-else>
              <p>Nessun film da visualizzare</p>
            </div>
          </div>
  
          <!-- Pulsanti per il carosello -->
          <button @click="prevSlide()" class="carousel-control-prev" type="button" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button @click="nextSlide()" class="carousel-control-next" type="button" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import TMdbApi from '@/services/TMdbApi';
  
  export default {
    props: {
      filmIds: Array, // Aggiunta della prop per gli ID dei film
      title: String, // Titolo del carosello
      listId: Number // ID della lista da passare come prop
    },
    data() {
      return {
        film: [], // Dati dei film
        imgUrl: "https://image.tmdb.org/t/p/original", // URL base per le immagini
        activeFilm: [], // Film attivi nel carosello
        active: [0, 1, 2, 3], // Indici attivi per i film da mostrare
      };
    },
    methods: {
      async fetchFilm() {
        try {
          // Verifica se ci sono ID di film
          if (this.filmIds && this.filmIds.length) {
            console.log(this.filmIds); // Debug degli ID dei film
            
            // Richiama i dati per ogni film
            const filmPromises = this.filmIds.map(id => TMdbApi().get(`/movie/${id}`));
            const filmResponses = await Promise.all(filmPromises);
  
            // Controllo se la risposta contiene dati validi
            this.film = filmResponses.map(response => response.data || null).filter(f => f); // Filtra i film nulli o non trovati
            console.log(this.film); // Debug dei film recuperati
  
            this.activefilm();
          } else {
            console.warn('Nessun ID film fornito.');
          }
        } catch (error) {
          console.error('Errore nel recupero dei film:', error);
        }
      },
      activefilm() {
        // Assegna i film agli indici attivi
        this.activeFilm = this.active.map(index => this.film[index]).filter(f => f);
      },
      nextSlide() {
        this.active.forEach((element, index, arr) => {
          element === this.film.length - 1 ? element = 0 : element++;
          arr[index] = element;
        });
        this.activefilm();
      },
      prevSlide() {
        this.active.forEach((element, index, arr) => {
          element === 0 ? element = this.film.length - 1 : element--;
          arr[index] = element;
        });
        this.activefilm();
      }
    },
    mounted() {
      this.fetchFilm();
    }
  };
  </script>
  
<style lang="scss" scoped>
.carousel-control-next, .carousel-control-prev{
    width: 5%;
    border-radius: 2em;
}
.carousel-container{
    padding-bottom: 2rem;
}
.h1{
    text-align: center;
    color: whitesmoke;
    padding-bottom: 0.5rem;
}

.film-info{
    position: absolute;
    bottom: 1rem;
    left: 0;
    right: 0;
    text-align: center;
    .h6{
        background-color: darkslategray;
        border-radius: 0.5rem;
        color: whitesmoke;
        text-decoration: none;
        
    }
}

</style>  