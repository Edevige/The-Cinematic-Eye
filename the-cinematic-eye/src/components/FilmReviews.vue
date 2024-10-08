<template> 
  <div v-if="reviews.length > 0">
    <div class="media-voto">
      Media dei voti: {{ mediaVoto.toFixed(1) }}
    </div>
    <!-- Filtro le recensioni con un testo non vuoto o composto solo da spazi -->
    <div v-for="item in reviewsFiltrate" :key="item.id" class="container">
      <div class="position-relative">
        <div class="row w-100 mx-auto review-container">
          <div class="col-2">
            {{ item.UserId }}
          </div>
          <div class="col-9">
            <div v-if="item.spoiler && !spoilerRevealed">
              <div class="alert alert-warning">
                ⚠️ Allerta Spoiler!
              </div>
              <button @click="toggleSpoiler(index)" class="btn btn-primary">
                Mostra recensione
              </button>
            </div>
            <div v-else>
              {{ item.text }}
              <button @click="handleLike(item.id)">Like</button> {{ item.like }}
              <button @click="handleDislike(item.id)">Dislike</button> {{ item.dislike }}
            </div>
          </div>
          <div class="col-1">
            {{ item.spoiler }}
          </div>
        </div>
        <!-- Pulsanti Like e Dislike -->
        <div class="d-flex justify-content-start gap-2 mt-2">
          
        </div>
      </div>
    </div>
  </div>
  <div v-else class="container">
    <div class="position-relative">
      <div class="row w-100 mx-auto">
        <div>
          <!-- Spinner durante il caricamento -->
          <div v-if="loading">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <!-- Messaggio quando la lista recensioni è vuota -->
          <div v-else-if="reviews.length === 0">
            <p class="lista-vuota" style="padding-top: 3rem; color: whitesmoke; font-size: 35px; margin-bottom: 0px;">
              Non ci sono ancora recensioni
            </p>
            <p class="lista-vuota" style="color: whitesmoke; font-size: 20px;">
              Lascia una recensione per primo per questo film
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiUtils from '@/services/apiUtils';

export default {
  props: {
    filmID: Number
  },
  data() {
    return {
      reviews: [],
      loading: false,
      spoilerRevealed:false,
    };
  },
  computed: {
    mediaVoto() {
      // Filtra solo le recensioni con un rating valido (numero)
      const reviewsConVoto = this.reviews.filter(review => typeof review.rating === 'number');
      if (reviewsConVoto.length === 0) return 0; // Se non ci sono voti validi, ritorna 0
      // Somma i rating validi
      const sommaVoti = reviewsConVoto.reduce((total, review) => total + review.rating, 0);
      // Calcola la media dividendo la somma per il numero di recensioni con un rating valido
      return sommaVoti / reviewsConVoto.length;
    },
    reviewsFiltrate() {
      // Ordina le recensioni dalla più recente alla meno recente in base alla data di creazione
      const sortedReviews = this.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Filtra le recensioni con testo non vuoto o con soli spazi
      return sortedReviews.filter(review => review.text && review.text.trim() !== '');
    },
  },
  methods: {
    
    async getReviews(id) {
      try {
        const response = await apiUtils.getReviews({ film_id: id });
        // Assicurati che tutte le recensioni abbiano like e dislike definiti
        this.reviews = response.data.reviews.map(review => ({
          ...review,
          like: review.like || 0,  // Valore di default 0
          dislike: review.dislike || 0,  // Valore di default 0
          userLiked: false,
          userDisliked: false
        }));
      } catch (e) {
        console.log(e);
      }
    },

    toggleSpoiler(index){
      // Cambia lo stato di visibilità dello spoiler
      this.spoilerRevealed=true;
    },

    async handleLike(reviewId) {
      try {
        const token = this.$store.state.token;
        const response = await apiUtils.toggleLikeDislike({
          token,
          review_id: reviewId,
          like: true
        });

        // Aggiorna immediatamente i like/dislike sulla recensione
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
          review.like = response.data.like;
          review.dislike = response.data.dislike;
        }
      } catch (error) {
        console.error('Errore nel like:', error);
        //alert('Impossibile caricare like/dislike per questa recensione.');
      }
    },
    async handleDislike(reviewId) {
      try {
        const token = this.$store.state.token;
        const response = await apiUtils.toggleLikeDislike({
          token,
          review_id: reviewId,
          like: false
        });

        // Aggiorna immediatamente i like/dislike sulla recensione
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
          review.like = response.data.like;
          review.dislike = response.data.dislike;
        }
      } catch (error) {
        console.error('Errore nel dislike:', error);
        //alert('Impossibile caricare like/dislike per questa recensione.');
      }
    },

  },
  mounted() {
    this.getReviews(this.filmID);
  }
};
</script>


<style lang="scss" scoped>
  .spinner-border{
    color: whitesmoke;
    --bs-spinner-width: 5rem;
    --bs-spinner-height: 5rem;
    --bs-spinner-border-width: 1em;
  }
  .review-container{
    color: whitesmoke;
    font-size: large;
  }
</style>