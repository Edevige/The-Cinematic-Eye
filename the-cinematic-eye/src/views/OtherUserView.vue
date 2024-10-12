<template>
  <div v-if="user">
    <div v-if="user.private && user.private === true">
      <h1>Profilo di {{ user.username }} è privato</h1>
    </div>
    <div v-else>
      <h1>Profilo di {{ user.username }}</h1>

      <!-- Pulsante Segui/Non Segui -->
      <button v-if="isFollowing" @click="rmFollow(this.user.id)" class="btn btn-outline-light flex-fill" type="button">
        <i class="bi bi-heartbreak-fill"> Smetti di seguire</i>
      </button>
      <button v-else @click="addFollow(this.user.id)" class="btn btn-outline-light flex-fill" type="button">
        <i class="bi bi-suit-heart-fill"> Segui</i></button>

      <!-- Pulsante Promuovi e il form -->
      <button v-if="isAdmin" @click="togglePromotionForm" class="btn btn-outline-success">Cambia Ruolo</button>

      <!-- Pulsante Sospendi/Riattiva -->
      <button v-if="isAdmin" @click="toggleSuspendUser" class="btn" :class="user.suspended ? 'btn-outline-danger' : 'btn-outline-warning'">
        <i :class="user.suspended ? 'bi bi-person-check-fill' : 'bi bi-person-x-fill'"></i>
        {{ user.suspended ? 'Riattiva Utente' : 'Sospendi Utente' }}
      </button>

      <!-- Form di Promozione -->
      <div v-if="showPromotionForm" class="promotion-form">
        <h3>Modifica il ruolo di {{ user.username }}</h3>
        <form @submit.prevent="submitPromotion">
          <div class="form-group">
            <label for="roleSelect">Seleziona Ruolo:</label>
            <select v-model="selectedRole" class="form-control" id="roleSelect">
              <!-- Opzioni per un utente base -->
              <option v-if="userRole === 0" value="2">Utente Pro</option>
              <option v-if="userRole === 0" value="1">Amministratore</option>

              <!-- Opzioni per un utente pro -->
              <option v-if="userRole === 2" value="0">Utente Base</option>
              <option v-if="userRole === 2" value="1">Amministratore</option>

              <!-- Opzioni per un amministratore -->
              <option v-if="userRole === 1" value="0">Utente Base</option>
              <option v-if="userRole === 1" value="2">Utente Pro</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary mt-2">Salva</button>
          <button type="button" @click="togglePromotionForm" class="btn btn-secondary mt-2">Annulla</button>
        </form>
      </div>

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
      showPromotionForm: false, // Per visualizzare o nascondere il form di promozione
      selectedRole: null,       // Ruolo selezionato nel form
      userRole: 0               // Imposta il ruolo di default a base (0) se non esiste nella tabella UserRole
    };
  },
  methods: {
    async toggleSuspendUser() {
      try {
        const token = this.$store.state.token;  // Recupera il token per l'autenticazione

        // Inverti lo stato attuale della sospensione
        const newSuspendedStatus = !this.user.suspended;

        // Effettua una chiamata API per aggiornare lo stato di sospensione dell'utente
        const response = await apiUtils.updateUserSuspension({
          userId: this.user.id,
          suspended: newSuspendedStatus,
          token
        });

        if (response && response.data) {
          this.user.suspended = response.data.suspended;  // Aggiorna lo stato locale
          console.log('Stato di sospensione aggiornato:', response.data.suspended);
        }
      } catch (error) {
        console.error('Errore nella modifica dello stato di sospensione:', error);
      }
    },
    async fetchUserData() {
      try {
        const response = await apiUtils.getUserByUsername(this.username);
        if (response && response.data) {
          this.user = response.data;

          // Verifica se l'utente ha un ruolo nella tabella UserRole
          const roleResponse = await apiUtils.getUserRoleById(this.user.id);
          if (roleResponse && roleResponse.data) {
            this.userRole = roleResponse.data.role;  // Imposta il ruolo attuale
          } else {
            this.userRole = 0;  // Se non ha un ruolo nella tabella, è un utente base
          }
        }
      } catch (error) {
        console.error('Errore nel recupero delle informazioni utente:', error);
      }
    },

    // Metodo per aprire/chiudere il form di promozione
    togglePromotionForm() {
      this.showPromotionForm = !this.showPromotionForm;
      this.selectedRole = this.userRole;  // Imposta il ruolo selezionato inizialmente al ruolo attuale dell'utente
    },

    // Metodo per inviare il ruolo selezionato
    async submitPromotion() {
      try {
        const response = await apiUtils.updateUserRole({
          token: this.$store.state.token,
          userId: this.user.id,
          role: this.selectedRole
        });
        if (response && response.data) {
          console.log('Ruolo aggiornato con successo:', response.data);
          this.showPromotionForm = false;  // Chiudi il form dopo l'aggiornamento
          this.fetchUserData();            // Aggiorna i dati dell'utente
        }
      } catch (error) {
        console.error('Errore nell\'aggiornamento del ruolo:', error);
      }
    },

    // Funzione per verificare se l'utente loggato è un amministratore
    async checkUserRole() {
      try {
        const token = this.$store.state.token;
        const response = await apiUtils.getUserRole({
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response && response.data) {
          this.isAdmin = response.data.role === 1;  // Solo gli amministratori possono promuovere
        }
      } catch (error) {
        console.error('Errore nel recuperare il ruolo dell\'utente loggato:', error);
      }
    },

    // Funzione per formattare la data
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
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
.spinner-border {
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
