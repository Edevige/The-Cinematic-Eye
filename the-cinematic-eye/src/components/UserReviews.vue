<template>
    <div>
      <div v-if="reviews.length">
        <div v-for="review in reviews" :key="review.id" class="review-card">
          <h3>Film: {{ review.film_id }}</h3>
          <p><strong>Voto:</strong> {{ review.rating }}</p>
          <p><strong>Testo:</strong> {{ review.text }}</p>
          <p v-if="review.spoiler" class="spoiler-warning">Attenzione: contiene spoiler</p>
          <button @click="editReview(review)" class="btn btn-primary">Modifica</button>
          <button @click="deleteReview(review.id)" class="btn btn-danger">Elimina</button> <!-- Pulsante Elimina -->
        </div>
      </div>
      <p v-else class="lista-vuota">Non hai ancora fatto nessuna recensione.</p>
  
      <!-- Modale per la modifica della recensione -->
      <div v-if="selectedReview" class="edit-review-modal">
        <h3>Modifica la tua recensione</h3>
        <textarea v-model="editForm.text"></textarea>
        <input type="checkbox" v-model="editForm.spoiler" /> Contiene spoiler
        <button @click="submitEdit" class="btn btn-success">Salva</button>
        <button @click="cancelEdit" class="btn btn-secondary">Annulla</button>
      </div>
    </div>
  </template>
  
  <script>
  import apiUtils from '@/services/apiUtils';
  
  export default {
    name: 'UserReviews',
    props: {
        filmObj: Object
    },
    components: {

    },
    data() {
      return {
        reviews: [],
        selectedReview: null,
        editForm: {
          rating: 0,
          text: '',
          spoiler: false,
        }
      };
    },
    methods: {
      async fetchUserReviews() {
        try {
          const token = this.$store.state.token;
          if (!token) {
            console.error('Token non trovato.');
            return;
          }
          const response = await apiUtils.getUserReviews({
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.reviews = response.data.reviews;
        } catch (error) {
          console.error('Errore nel recupero delle recensioni:', error);
        }
      },
      editReview(review) {
        this.selectedReview = review;
        this.editForm.rating = review.rating;
        this.editForm.text = review.text;
        this.editForm.spoiler = review.spoiler;
      },
      async submitEdit() {
        try {
          const token = this.$store.state.token;
          const updatedReview = {
            id: this.selectedReview.id,
            rating: this.editForm.rating,
            text: this.editForm.text,
            spoiler: this.editForm.spoiler,
          };
          const response = await apiUtils.updateReview(updatedReview, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // Aggiorna la recensione nella lista
          const index = this.reviews.findIndex(r => r.id === this.selectedReview.id);
          if (index !== -1) {
            this.reviews[index] = response.data.review;
          }
          this.selectedReview = null; // Chiudi il form
        } catch (error) {
          console.error('Errore nella modifica della recensione:', error);
        }
      },
      async deleteReview(reviewId) {
        try {
          const token = this.$store.state.token;
          const response = await apiUtils.deleteReview(reviewId, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // Rimuovi la recensione dalla lista dopo la cancellazione
          this.reviews = this.reviews.filter(review => review.id !== reviewId);
        } catch (error) {
          console.error('Errore durante l\'eliminazione della recensione:', error);
        }
      },
      cancelEdit() {
        this.selectedReview = null;
      }
    },
    mounted() {
      this.fetchUserReviews();
    }
  };
  </script>
  
  <style scoped>
  .lista-vuota{
    text-align: center;
    padding: 2rem;
    color: whitesmoke;
    font-size: x-large;
  };
  .edit-review-modal {
    border: 1px solid #ddd;
    padding: 20px;
    margin-top: 20px;
    background-color: #f9f9f9;
  }
  </style>
  
  