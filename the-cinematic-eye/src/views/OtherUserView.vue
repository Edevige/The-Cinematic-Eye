<template>
  <div v-if="user">
    <div v-if="user.private && user.private === true">
      <h1>Profilo di {{ user.username }} è privato</h1>
    </div>
    <div v-else>
      <h1>Profilo di {{ user.username }}</h1>

      <!-- Pulsante Segui/Non Segui -->
      <button v-if="isFollowing" @click="rmFollow(this.user.id)"  class="btn btn-outline-light flex-fill" 
          type="button"><i class="bi bi-heartbreak-fill"> Smetti di seguire</i></button>
      <button v-else @click="addFollow(this.user.id)" class="btn btn-outline-light flex-fill"
          type="button"><i class="bi bi-suit-heart-fill"> Segui</i></button>
      
      <!-- Condizionalmente mostra il pulsante Promuovi solo agli amministratori -->
      <button v-if="isAdmin" @click="promoteUser">Promuovi</button>
      
      <!-- Mostra i dati dell'utente -->
      <div class="user-info">
        <p><strong>ID:</strong> {{ user.id || 'Non specificato' }}</p>
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
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
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
        isAdmin: false,
      };
    },
    methods: {
      async fetchUserData() {
        try {
          const response = await apiUtils.getUserByUsername(this.username);
          if (response && response.data) {
            this.user = response.data;

            // Solo esegui il controllo dello stato del follow dopo che l'utente è stato caricato
            if (this.user && this.user.id) {
              const loggedUser = await apiUtils.getUserById(this.$store.state.user.id);
              if (loggedUser && loggedUser.data && Array.isArray(loggedUser.data.seguiti)) {
                this.isFollowing = loggedUser.data.seguiti.includes(this.user.id);
              }
            }
          }
        } catch (error) {
          console.error('Errore nel recupero delle informazioni utente:', error);
        }
      },

      async addFollow(id) {
        try {
          const response = await apiUtils.addFollow({
            token: this.$store.state.token,
            follow_id: this.user.id
          });

          if (response && response.data) {
            const userUpd = { ...this.$store.state.user, seguiti: response.data.followArr };
            this.$store.dispatch('setUser', userUpd);
          }

        } catch (error) {
          console.error('Errore nell\'aggiungere il follow:', error);
        }
      },

      async rmFollow(id) {
        try {
          const response = await apiUtils.rmFollow({
            token: this.$store.state.token,
            follow_id: this.user.id
          });

          if (response && response.data) {
            const userUpd = { ...this.$store.state.user, seguiti: response.data.followArr };
            this.$store.dispatch('setUser', userUpd);
          }

        } catch (error) {
          console.error('Errore nel rimuovere il follow:', error);
        }
      },

      formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      },

      // Funzione per verificare se l'utente loggato è un amministratore
      async checkUserRole() {
        try {
          const token = this.$store.state.token;
          const response = await apiUtils.getUserRole({
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response && response.data) {
            // Se il ruolo è 1, l'utente è un amministratore
            this.isAdmin = response.data.role === 1;
          }
        } catch (error) {
          console.error('Errore nel recuperare il ruolo dell\'utente:', error);
        }
      },
    },
    mounted() {
      this.fetchUserData();
      this.checkUserRole();
    },
    computed: {
      isFollowing() {
        if (this.$store.state.logged && Array.isArray(this.$store.state.user.seguiti)) {
          return this.$store.state.user.seguiti.includes(this.user?.id);
        }
        return false;
      },
    }
  };
</script>
  
<style scoped>
  .spinner-border{
    color: whitesmoke;
    --bs-spinner-width: 5rem;
    --bs-spinner-height: 5rem;
    --bs-spinner-border-width: 1em;
  }
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
