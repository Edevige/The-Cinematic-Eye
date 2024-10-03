<template>
  <div v-if="reviews.length > 0">
    <div v-for="item in reviews" :key="item.id" class="container">
      <div class="position-relative">
        <div class="row w-100 mx-auto review-container">
          <div class="col-2">
            {{ item.UserId }}
          </div>
          <div class="col-9">
            {{ item.text }}
          </div>
          <div class="col-1">
            {{ item.spoiler }}
          </div>
        </div>
        <!-- Pulsanti Like e Dislike -->
        <div class="d-flex justify-content-start gap-2 mt-2">
          <button @click="likeReview(item.id)" class="btn btn-outline-success">
            👍 Like ({{ item.like }})
          </button>
          <button @click="dislikeReview(item.id)" class="btn btn-outline-danger">
            👎 Dislike ({{ item.dislike }})
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="container">
    <div class="position-relative ">
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
    filmID: Number,
  },
  data() {
    return {
      reviews: [],
      loading: false,
    };
  },
  methods: {
    async getReviews(id) {
      try {
        const response = await apiUtils.getReviews({ film_id: id });
        this.reviews = response.data.reviews;
      } catch (e) {
        console.log(e);
      }
    },
    async likeReview(reviewId) {
      try {
        const token = this.$store.state.token;
        if (!token) {
          throw new Error('Devi essere loggato per mettere like.');
        }
        const response = await apiUtils.likeReview({ review_id: reviewId, token: token });
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
          review.like = response.data.like;
          review.dislike = response.data.dislike;
        }
      } catch (error) {
        if (error.response && error.response.data.error) {
          console.error('Errore durante il like:', error.response.data.error);
          alert(error.response.data.error);
        } else {
          console.error('Errore durante il like:', error);
          alert(error.message);
        }
      }
    },
    async dislikeReview(reviewId) {
      try {
        const token = this.$store.state.token;
        if (!token) {
          throw new Error('Devi essere loggato per mettere dislike.');
        }
        const response = await apiUtils.dislikeReview({ review_id: reviewId, token: token });
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
          review.like = response.data.like;
          review.dislike = response.data.dislike;
        }
      } catch (error) {
        if (error.response && error.response.data.error) {
          console.error('Errore durante il dislike:', error.response.data.error);
          alert(error.response.data.error);
        } else {
          console.error('Errore durante il dislike:', error);
          alert(error.message);
        }
      }
    },
  },
  mounted() {
    this.getReviews(this.filmID);
  },
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