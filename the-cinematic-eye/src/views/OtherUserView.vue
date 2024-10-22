<template>
  <div v-if="user">
    <div v-if="user.private && user.private === true">
      <h1>Profilo di {{ user.username }} è privato</h1>
    </div>
    <div v-else>
      <h1>Profilo di {{ user.username }}</h1>

      <!-- Pulsante Segui/Non Segui -->
      <button v-if="!(this.$store.state.logged)" disabled class="btn btn-outline-light flex-fill" type="button">
        <i class="bi bi-suit-heart-fill"> Segui</i></button>
      <button v-else-if="isFollowing" @click="rmFollow(this.user.id)" class="btn btn-outline-light flex-fill" type="button">
        <i class="bi bi-heartbreak-fill"> Smetti di seguire</i>
      </button>
      <button v-else @click="addFollow(this.user.id)" class="btn btn-outline-light flex-fill" type="button">
        <i class="bi bi-suit-heart-fill"> Segui</i></button>

      <!-- Pulsante Promuovi e il form -->
      <button v-if="isAdmin" @click="togglePromotionForm" class="btn btn-outline-success">Cambia Ruolo</button>
      
      <!-- Pulsante Ban/Togli il Ban -->
      <div v-if="isAdmin">
      <button v-if="isUserBanned" @click="rmBan(this.user.id)" class="btn btn-outline-light flex-fill" type="button">
        <i class="bi bi-check2-circle"> Togli il Ban</i>
      </button>
      <button v-else @click="showBanForm = !showBanForm" class="btn btn-outline-light flex-fill" type="button">
        <i class="bi bi-ban"> Ban Utente</i></button>
      </div>

      <!-- Pulsante Sospendi/Riattiva -->
      <div v-if="isAdmin">
        <button v-if="!isUserSuspended" @click="showSuspendForm = !showSuspendForm" class="btn" :class="user.suspended ? 'btn-outline-danger' : 'btn-outline-warning'">
        <i :class="user.suspended ? 'bi bi-person-check-fill' : 'bi bi-person-x-fill'"></i>
        {{ user.suspended ? 'Riattiva Utente' : 'Sospendi Utente' }}
        </button>
        <button v-else @click="removeSuspended" class="btn">
          Togli la sospensione
        </button>
      </div>


      <!-- Form per sospendere utente -->
      <div v-if="showSuspendForm" class="suspend-form">
        <form @submit.prevent="suspendUser">
          <div class="form-group">
            <label for="suspendDuration">Sospendi per (in ore):</label>
            <input v-model="suspendDuration" type="number" class="form-control" id="suspendDuration" placeholder="Inserisci il numero di ore" min="1" required>
          </div>
          <button type="submit" class="btn btn-primary mt-2">Conferma Sospensione</button>
          <button type="button" @click="showSuspendForm = false" class="btn btn-secondary mt-2">Annulla</button>
        </form>
      </div>

      <!-- Form di Ban -->
      <div v-if="showBanForm" class="ban-form">
        <form @submit.prevent="addBan(this.user.id)">
          <div class="form-group">
            <label for="banReason">Motivo del Ban:</label>
            <input v-model="banReason" type="text" class="form-control" id="banReason" placeholder="Inserisci il motivo del ban" autocomplete="off" required>
          </div>
          <button type="submit" class="btn btn-primary mt-2">Invia</button>
          <button type="button" @click="showBanForm = false" class="btn btn-secondary mt-2">Annulla</button>
        </form>
      </div>

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
      userRole: 0,               // Imposta il ruolo di default a base (0) se non esiste nella tabella UserRole
      showBanForm: false,
      banReason: '',
      isUserBanned: false,
      isLoggedIn: this.$store.state.logged,
      showSuspendForm: false,  // Per controllare se mostrare il form di sospensione
      suspendDuration: 1,      // Durata della sospensione in ore (default a 1)
      isUserSuspended: false,
    };
  },
  methods: {
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
        }else {
          console.error('Errore: Utente non trovato.');
          this.user = null;
        }
      } catch (error) {
        console.error('Errore nel recupero delle informazioni utente:', error);
      }
    },

    // Funzione per sospendere l'utente per la durata specificata
    async suspendUser() {
      try {
        const token = this.$store.state.token;  // Recupera il token per l'autenticazione

        // Effettua una chiamata API per sospendere l'utente per la durata specificata
        const response = await apiUtils.suspendUser({
          userId: this.user.id,
          suspended: true,  // Sospendi l'utente
          duration: this.suspendDuration,  // Passa la durata della sospensione
          token
        });

        if (response && response.data) {
          this.user.suspended = response.data.suspended;  // Aggiorna lo stato locale
          this.showSuspendForm = false;  // Nascondi il form dopo la sospensione
          console.log('Utente sospeso per', this.suspendDuration, 'ore');
        }
      } catch (error) {
        console.error('Errore durante la sospensione dell\'utente:', error);
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
        if(this.$store.state.logged){
          const token = this.$store.state.token;
          const response = await apiUtils.getUserRole({
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response && response.data) {
            this.isAdmin = response.data.role === 1;  // Solo gli amministratori possono promuovere
          }
        }
      } catch (error) {
        console.error('Errore nel recuperare il ruolo dell\'utente loggato:', error);
      }
    },

    // Funzione per formattare la data
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },

    // Controlla se l'utente è bannato
    async isBan(userId) {
      try {
        const response = await apiUtils.isUserBanned(userId);  // Chiama l'API per controllare il ban
        if (response && response.data) {
          this.isUserBanned = response.data.ban === 1;
          this.isUserSuspended = response.data.ban === 2;
        } else {
          this.isUserBanned = false;
        }
      } catch (error) {
        console.error('Errore nel controllo del ban:', error);
        this.isUserBanned = false;  // Imposta a false se si verifica un errore
      }
    },

    // Aggiungi il ban all'utente
    async addBan(userId) {
    try {
        const token = this.$store.state.token;

        const banData = {
            user_id: userId,  // Assicurati che sia 'user_id' come nel backend
            text: this.banReason,
            token
        };

        const response = await apiUtils.addUserBan(banData);

        if (response && response.data) {
            // Aggiorna lo stato dell'utente nel Vuex store
            this.showBanForm = !this.showBanForm;
            this.banReason = '';
            this.isUserBanned = !this.isUserBanned;
            var userUpd = this.$store.state.user;
            userUpd.bannedUsers = response.data.bannedArr;  // Aggiorna la lista degli utenti bannati
            this.$store.dispatch('setUser', userUpd);
        }

    } catch (error) {
        console.error("Errore nell'aggiunta del ban:", error);
    }
},
    // Rimuovi il ban dall'utente
    async rmBan(userId) {
    try {
        const token = this.$store.state.token;

        const response = await apiUtils.removeUserBan(userId, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response && response.data) {
            // Aggiorna lo stato dell'utente nel Vuex store
            this.isUserBanned = !this.isUserBanned;
            var userUpd = this.$store.state.user;
            userUpd.bannedUsers = response.data.bannedArr;  // Aggiorna la lista degli utenti bannati
            this.$store.dispatch('setUser', userUpd);
        }

    } catch (error) {
        console.error("Errore nella rimozione del ban:", error);
    }
},

    
  },
  mounted() {
    this.fetchUserData().then(() => {
      if (this.user && this.user.id) {
        this.isBan(this.user.id);  // Chiama isBan solo se user.id esiste
        this.checkUserRole();  // Chiama altre funzioni solo se i dati dell'utente sono disponibili
      } else {
        console.error('Errore: Nessun utente trovato.');
      }
    });
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
.ban-form {
  margin-top: 10px;
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
