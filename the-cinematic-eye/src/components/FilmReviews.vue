<template>
  <div v-if="reviews.length > 0">
    <div class="media-voto">
      Media Voti: {{ mediaVoto.toFixed(1) }}
    </div>
    <div class="recensioni-titolo">
      Recensioni:
    </div>
    <div class="full-recensioni">
    <!-- Aggiungi il contenitore con scorrimento -->
    <div class="recensioni-container">
      <!-- Filtro le recensioni con un testo non vuoto o composto solo da spazi -->
      <div v-for="item in reviewsFiltrate" :key="item.id" class="container">
      <div @click="goToUserArea(item.User.username)">
      <div class="nome-utente">{{ item.User.username }}</div>
      </div>
        <div class="position-relative">
          <div class="row w-100 mx-auto review-container">
            <div class="col-3">
              Voto: {{ item.rating }}/10
            </div>
            <div class="col-6">
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
              </div>
              <hr>
            </div>
            <div class="col-3">
              <div>
                <!-- Pulsante Like con icona di pollice in su -->
                <button @click="handleLike(item.id)" class="icon-btn">
                  <i class="bi bi-hand-thumbs-up"></i>
                </button>
                {{ item.like }}
                <!-- Pulsante Dislike con icona di pollice in giù -->
                <button @click="handleDislike(item.id)" class="icon-btn" style="margin-left: 15px;">
                  <i class="bi bi-hand-thumbs-down"></i>
                </button>
                {{ item.dislike }}
              </div>
            </div>

            <!-- Pulsante Segnala Spoiler-->
            <div v-if="(isAdmin || isProUser) && !item.spoiler" class="col-12">
              <button @click="sendRequest(item)" class="spoiler-btn">Segnala Spoiler</button>
            </div>

            <!-- Se l'utente è un amministratore, mostra i pulsanti per modificare ed eliminare -->
            <div v-if="isAdmin">
              <button @click="Spoiler(item)">Cambia Spoiler</button>
              <button @click="deleteReview(item.id)">Elimina Recensione</button>
            </div>
          </div>
        </div>
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
              Non ci sono ancora recensioni </p>
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
      //loggedInUsername: this.$store.state.user.username,
      isAdmin: false,
      isProUser: false,
      //isLoggedIn: this.$store.state.logged,
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
    goToUserArea(username) {
      if(this.$store.state.logged){
        // Controlla se l'utente cliccato è lo stesso dell'utente loggato
        if (username === this.$store.state.user.username) {
          // Reindirizza alla pagina personale
          this.$router.push({ name: 'personalArea' });
        } else {
          // Reindirizza alla pagina dell'altro utente
          this.$router.push({ name: 'OtherUser', params: { username: username } });
        }
      }
    },
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

    //funzioni admin
    // Funzione per verificare se l'utente loggato è un amministratore
    async checkUserRole() {
      try {
        if(this.$store.state.logged){
          const token = this.$store.state.token;
          const response = await apiUtils.getUserRole({
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response && response.data) {
            this.isAdmin = response.data.role === 1;  // Solo gli amministratori possono promuovere
            this.isProUser = response.data.role === 2;
          }
        }
      } catch (error) {
        console.error('Errore nel recuperare il ruolo dell\'utente loggato:', error);
      }
    },
    // Metodo per cambiare lo stato spoiler di una recensione
    async Spoiler(review) {
      try {
        if (!review || typeof review !== 'object') {
          throw new Error('Oggetto recensione non valido.');
        }

        const token = this.$store.state.token;  // Recupera il token per l'autenticazione
        const newSpoilerStatus = !review.spoiler;  // Inverti lo stato attuale dello spoiler

        // Creazione dell'oggetto aggiornato per l'invio al backend
        const updatedReview = {
          id: review.id,
          rating: review.rating, 
          text: review.text,
          spoiler: newSpoilerStatus,  // Setta il nuovo stato dello spoiler
        };

        // Effettua la chiamata API per aggiornare la recensione
        const response = await apiUtils.updateReview(updatedReview, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Trova l'indice della recensione aggiornata nell'array delle recensioni
        const index = this.reviews.findIndex(r => r.id === review.id);
        if (index !== -1) {
          // Aggiorna lo stato spoiler solo per la recensione trovata
          this.reviews[index].spoiler = response.data.review.spoiler;
        }
      } catch (error) {
        console.error('Errore nella modifica della recensione:', error);
      }
    },

    // Metodo per eliminare una recensione
    async deleteReview(reviewId) {
      try {
        const token = this.$store.state.token;
        
        await apiUtils.deleteReview(reviewId, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
        });
        // Rimuovi la recensione dalla lista locale
        this.reviews = this.reviews.filter((r) => r.id !== reviewId);
      } catch (error) {
        console.error("Errore durante l'eliminazione della recensione:", error);
      }
    },
    // Funzione per inviare la segnalazione spoiler
    
    async sendRequest(item) {
        try {
            const userId = this.$store.state.user.id;

            const response = await apiUtils.createReport({
                reason: 'segnalazione spoiler',
                text: 'recensione numero: '+ item.id + ', relativa al film: '+ item.film_id + ', postata dall\'utente id: '+ item.UserId + '\n testo: '+ item.text + ', spoiler: '+ item.spoiler,
                userId: userId,
            });

            if (response && response.data) {
            console.log('Report inviato con successo:', response.data);
            }
            //this.successMessage = 'Report inviato con successo!'; // Messaggio di successo

            // Mostra il messaggio per 3 secondi
            /*setTimeout(() => {
                this.successMessage = ''; // Rimuove il messaggio dopo 3 secondi
            }, 2500);*/
        } catch (error) {
            console.error('Errore durante l\'invio del report:', error);
        }
    },

  },
  mounted() {
    this.getReviews(this.filmID);
    this.checkUserRole();
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
.full-recensioni{
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid whitesmoke;
  border-radius: 10px;
}
.review-container{
  color: whitesmoke;
  font-size: large;
  padding-bottom: 1rem;
}
.media-voto{
  color: whitesmoke;
  font-size: xx-large;
  padding-top: 2rem;
  padding-bottom: 1rem;
}
.recensioni-titolo{
  color: whitesmoke;
  font-size: xx-large;
  padding-bottom: 1rem;
}
.nome-utente{
  color: whitesmoke;
  font-size: large;
  padding-bottom: 0.5rem;
  cursor: pointer;
}
.icon-btn {
  background: none;  /* Nessuno sfondo */
  border: none;      /* Nessun bordo */
  padding: 0;        /* Rimuove padding */
  cursor: pointer;   /* Cambia il cursore per indicare che è cliccabile */
  font-size: 24px;   /* Dimensione dell'icona */
}
.icon-btn i {
  color: whitesmoke;       
}

.icon-btn:hover i {
  color: #007bff;    
}
.recensioni-container {
  max-height: 400px; /* Altezza massima per il contenitore delle recensioni */
  overflow-y: auto;  /* Aggiunge una barra di scorrimento verticale quando necessario */
  padding-right: 15px; /* Spazio per la barra di scorrimento */
}
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
}

</style>