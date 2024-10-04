<template>
  <div>
    <div v-if="reviews.length">
      <div v-for="review in reviews" :key="review.id" class="review-card">
        <div class="row">
          <!-- Colonna per l'immagine del film -->
          <div class="col-3">
            <img 
              v-if="review.film && review.film.poster_path" 
              class="img img-fluid w-auto mt-4" 
              :src="imgUrl + review.film.poster_path" 
              alt="Film Cover" 
            />
          </div>
          <!-- Colonna per il titolo e la recensione -->
          <div class="col-9">
            <div class="review-header">
              <h3></h3>
              <div class="action-buttons">
                <button class="btn btn-outline-light" @click="editReview(review)" type="button">
                  <i class="bi bi-pencil-square"></i> Modifica</button>
                <button class="btn btn-outline-light" @click="deleteReview(review.id)" type="button">
                  <i class="bi bi-trash"></i> Elimina</button>
              </div>
            </div>
            <div v-if="review.film">
              <h2 style="margin-top: 2rem;">{{ review.film.title }}</h2>
            </div>
            <p style="font-size: xx-large;"><strong>Voto:</strong> {{ review.rating }}</p>
            <p><strong>Testo:</strong> {{ review.text }}</p>
            <p v-if="review.spoiler" class="spoiler-warning" style="font-size: x-large;">Attenzione: contiene spoiler</p>

            <!-- Modale per la modifica della recensione -->
            <div v-if="selectedReview && selectedReview.id === review.id" class="edit-review-modal">
              <div class="mb-3 text-center">
                <p style="margin-bottom: 0;">Voto</p>
                <label for="reviewRating" class="form-label"></label>
                <input type="range" id="rating" v-model="editForm.rating" min="0" max="10" step="0.5" class="form-range narrow-range">
                <p>Voto selezionato: {{ editForm.rating }}</p> 
              </div>
              <div class="mb-3 text-center">
                <label for="reviewText" class="form-label">Recensione</label>
                <textarea v-model="editForm.text" id="reviewText" class="form-control narrow-textarea" rows="3"></textarea>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="form-check">
                      <input v-model="editForm.spoiler" type="checkbox" id="spoilerCheck" class="form-check-input">
                      <label class="form-check-label" for="spoilerCheck">Contiene spoiler</label>
                  </div>
                  <button @click="submitEdit" class="btn btn-outline-light" style="margin-left: 300px; width: 120px;">Salva</button>
                  <button @click="cancelEdit" class="btn btn-secondary" style="width: 120px;">Annulla</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="lista-vuota">Non hai ancora fatto nessuna recensione.</p>
  </div>
</template>

<script>
import apiUtils from '@/services/apiUtils';
import axios from 'axios';

export default {
  name: 'UserReviews',
  data() {
    return {
      reviews: [],
      selectedReview: null,
      imgUrl: 'https://image.tmdb.org/t/p/original/', // URL base per le immagini dei film
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

        // Recuperiamo i dettagli del film per ogni recensione
        const reviewsWithFilms = await Promise.all(
          response.data.reviews.map(async review => {
            const filmDetails = await this.fetchFilmDetails(review.film_id);
            return { ...review, film: filmDetails };
          })
        );
        
        this.reviews = reviewsWithFilms;
      } catch (error) {
        console.error('Errore nel recupero delle recensioni:', error);
      }
    },

    async fetchFilmDetails(filmId) {
      const apiKey = 'f9ef60dfd862f8b1324df4942d314072'; // Inserisci qui la tua chiave API di TMDB
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${filmId}?api_key=${apiKey}`);
        return response.data; // Dettagli del film
      } catch (error) {
        console.error('Errore nel recupero dei dettagli del film per ID:', filmId, error);
        return null;
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

    // Trova l'indice della recensione aggiornata
    const index = this.reviews.findIndex(r => r.id === this.selectedReview.id);
    if (index !== -1) {
      // Mantieni intatti i dettagli del film originale
      const updatedReviewWithFilm = {
        ...response.data.review,
        film: this.reviews[index].film, // Mantieni il film
      };
      
      // Aggiorna la recensione nell'array
      this.reviews.splice(index, 1, updatedReviewWithFilm);
    }

    this.selectedReview = null; // Chiudi il form
  } catch (error) {
    console.error('Errore nella modifica della recensione:', error);
  }
}
,

    async deleteReview(reviewId) {
      try {
        const token = this.$store.state.token;
        await apiUtils.deleteReview(reviewId, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
.lista-vuota {
  text-align: center;
  padding: 2rem;
  color: whitesmoke;
  font-size: x-large;
}

.review-card {
  margin-bottom: 20px;
  padding: 1rem;
  margin-top: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid whitesmoke;
  border-radius: 10px;
  color: whitesmoke;
}

.review-header {
  display: flex;
  justify-content: space-between;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.edit-review-modal {
  background-color: rgb(26, 68, 67);
  color: whitesmoke;
  border-radius: 15px;
  padding: 1rem;
  text-align: center;
}

.narrow-range {
  width: 500px;
}

.narrow-textarea {
  width: 700px;
  margin: 0 auto;
}
</style>


