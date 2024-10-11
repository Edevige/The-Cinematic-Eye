<template>
    <div v-if="user">
      <div v-if="user.private && user.private === true">
        <h1>Profilo di {{ user.username }} è privato</h1>
      </div>
      <div v-else>
        <h1>Profilo di {{ user.username }}</h1>

        <!-- Pulsante Segui/Non Segui -->
        <button @click="toggleFollow">
          {{ isFollowing ? 'Non Seguire' : 'Segui' }}
        </button>
        
        <!-- Mostra i dati dell'utente -->
        <div class="user-info">
          <p><strong>Nome:</strong> {{ user.name || 'Non specificato' }}</p>
          <p><strong>Data di nascita:</strong> {{ formatDate(user.birthdate) }}</p>
          <p><strong>Biografia:</strong> {{ user.bio || 'Nessuna biografia disponibile' }}</p>
    
          <div v-if="user.favorites && user.favorites.length > 0">
            <h3>Film preferiti:</h3>
            <ul>
              <li v-for="filmId in user.favorites" :key="filmId">Film ID: {{ filmId }}</li>
            </ul>
          </div>
    
          <div v-if="user.seen && user.seen.length > 0">
            <h3>Film visti:</h3>
            <ul>
              <li v-for="filmId in user.seen" :key="filmId">Film ID: {{ filmId }}</li>
            </ul>
          </div>
    
          <div v-if="user.lists && user.lists.length > 0">
            <h3>Liste di film seguite:</h3>
            <ul>
              <li v-for="listId in user.lists" :key="listId">Lista ID: {{ listId }}</li>
            </ul>
          </div>
    
          <div v-if="user.seguiti && user.seguiti.length > 0">
            <h3>Seguiti:</h3>
            <ul>
              <li v-for="followedUserId in user.seguiti" :key="followedUserId">Utente ID: {{ followedUserId }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Caricamento utente...</p>
    </div>
</template>
  
<script>
  import apiUtils from '@/services/apiUtils';
  
  export default {
    props: {
      username: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        user: null,
        isFollowing: false,  // Stato per sapere se stai già seguendo l'utente
      };
    },
    methods: {
      async fetchUserData() {
        try {
          const response = await apiUtils.getUserByUsername(this.username);
          this.user = response.data;

          // Solo esegui il controllo dello stato del follow dopo che l'utente è stato caricato
          if (this.user && this.user.id) {
            // Verifica se l'utente loggato sta già seguendo questo utente
            const loggedUser = await apiUtils.getUserById(this.$store.state.user.id);
            this.isFollowing = loggedUser.data.seguiti.includes(this.user.id);
          }
        } catch (error) {
          console.error('Errore nel recupero delle informazioni utente:', error);
        }
      },

      async toggleFollow() {
        try {
          const action = this.isFollowing ? 'unfollow' : 'follow';
          const token = this.$store.state.token;

          // Chiamata API per seguire/smettere di seguire l'utente
          const response = await apiUtils.toggleFollowUser(this.username, action, token);

          if (response.data) {
            // Aggiorna lo stato locale solo se l'azione è andata a buon fine
            this.isFollowing = !this.isFollowing;

            // Aggiorna anche i dati dell'utente loggato
            const loggedUser = await apiUtils.getUserById(this.$store.state.user.id);
            this.$store.commit('updateUser', loggedUser.data);  // Supponendo che tu abbia un metodo di mutazione per aggiornare i dati utente
          }
        } catch (error) {
          console.error('Errore nel seguire/non seguire l\'utente:', error);

          // Gestione degli errori di follow doppio
          if (error.response && error.response.status === 400 && error.response.data.error === 'Utente già seguito.') {
            this.errorMessage = 'Stai già seguendo questo utente.';
          }
        }
      },


      formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      }
    },
    mounted() {
      this.fetchUserData();
    }
  };
</script>
  
<style scoped>
  .user-info {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 10px;
    border: 1px solid whitesmoke;
  }
  
  h1, h3 {
    color: whitesmoke;
  }
  
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  
  li {
    margin-bottom: 0.5rem;
    color: whitesmoke;
  }
</style>