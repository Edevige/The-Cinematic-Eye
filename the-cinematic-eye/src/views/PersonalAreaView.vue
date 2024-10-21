<template> 
  <div class="personal-area">
    <h1>Area Personale</h1>
    <div class="inside-personal-area">

      <div v-if="user">
        <div class="user-info">
          <label for="Username">Username: {{ user.username }}</label>
          <button class="btn-update" type="button" @click="update(1)">Aggiorna Username</button>
          <div v-if="selezioneNuovoUsername" class="input-group">
            <input v-model="newUsername" placeholder="Inserisci Nuovo Username" class="input-text">
            <button class="btn-confirm" type="button" @click="confermaModifica(newUsername, 1)">Conferma</button>
          </div>

          <!-- Controllo se l'utente ha google_id, in tal caso non mostriamo le opzioni per email e password -->
          <div v-if="!user.google_id">
            <label for="Email">Email: {{ user.email }}</label>
            <button class="btn-update" type="button" @click="update(2)">Aggiorna Email</button>
            <div v-if="selezioneNuovaEmail" class="input-group">
              <input v-model="newEmail" placeholder="Inserisci Nuova Email" type="email" class="input-text">
              <button class="btn-confirm" type="button" @click="confermaModifica(newEmail, 2)">Conferma</button>
            </div>

            <label for="Password">Password: {{user.password}}</label>
            <button class="btn-update" type="button" @click="update(3)">Aggiorna Password</button>
            <div v-if="selezioneNuovaPassword" class="input-group">
              <input v-model="newPassword" placeholder="Inserisci Nuova Password" type="password" class="input-text">
              <button class="btn-confirm" type="button" @click="confermaModifica(newPassword, 3)">Conferma</button>
            </div>
          </div>

          <!-- Se l'utente ha google_id, mostra un messaggio stilizzato -->
          <div v-else class="info-box">
            <i class="icon-warning"></i>
            <p>Non è possibile modificare email e password: accesso effettuato tramite Google!</p>
          </div>

          <label for="Name">Nome: {{ user.name }}</label>
          <button class="btn-update" type="button" @click="update(0)">Aggiorna Nome</button>
          <div v-if="selezioneNuovoNome" class="input-group">
            <input v-model="newName" placeholder="Inserisci Nuovo Nome" class="input-text">
            <button class="btn-confirm" type="button" @click="confermaModifica(newName, 0)">Conferma</button>
          </div>

          <div v-if="user.birthdate">
            <label for="Birthday">Compleanno: {{ formatDate(user.birthdate) }}</label>
            <button class="btn-update" type="button" @click="update(4)">Aggiorna Data</button>
          </div>
          <div v-else="!user.birthdate">
            <label for="Birthday">Non hai inserito il tuo Compleanno</label>
            <button class="btn-update" type="button" @click="update(4)">Inserisci Data</button>
          </div>
          <div v-if="selezioneNuovoCompleanno" class="input-group">
            <input v-model="newBirthday" placeholder="Inserisci Nuova Data" type="date" class="input-text">
            <button class="btn-confirm" type="button" @click="confermaModifica(newBirthday, 4)">Conferma</button>
          </div>

          <div class="newsletter-section">
            <div v-if="user && seguace">
              <label for="Newsletter">Sei iscritto alla newsletter</label>
              <button class="btn-secondary" type="button" @click="cancelNewsletter()">Cancella l'iscrizione</button>
            </div>
            <div v-else-if="user && !seguace">
              <label for="Newsletter">Non sei iscritto alla newsletter</label>
              <button class="btn-primary" type="button" @click="subscribeNewsletter()">Iscriviti</button>
            </div>
          </div>

          <div class="privacy-section">
            <input type="checkbox" v-model="user.private" @change="togglePrivacy" />
            <span v-if="user.private">Il tuo profilo è privato</span>
            <span v-else>Il tuo profilo è pubblico</span>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Caricamento Pagina o Errore</p>
      </div>

      <div class="action-buttons">
        <button class="btn-primary" type="button" @click="logout()">Logout</button>
        <button class="btn-danger" type="button" @click="handleDeleteAccount()">Elimina Account</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.personal-area {
  background-color: #F5F9F6; /* Soft green background */
  padding: 20px;
  border-radius: 10px;
  max-width: 800px;
  margin: 0 auto;
  color: #2C3E50;
  font-family: 'Arial', sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Aggiungi un'ombra per dare profondità */
}

.inside-personal-area {
  padding: 20px;
  background-color: #E8F5E9; /* Light green background */
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Meno ombra rispetto al box esterno */
  margin-bottom: 20px;
}

h1 {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  color: #388E3C; /* Green tone for the title */
  margin-bottom: 20px; /* Aggiungi uno spazio sotto il titolo */
}

label {
  font-size: 18px;
  margin-bottom: 8px;
  display: block; /* Imposta il display a block per separare meglio i campi */
  color: #2C3E50; /* Testo scuro per una migliore leggibilità */
}

.input-group {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px; /* Aggiungi spaziatura tra gli elementi */
}

.input-text {
  padding: 10px; /* Aumenta il padding per un input più grande e facile da usare */
  border: 1px solid #D4E6D4;
  border-radius: 8px; /* Arrotonda i bordi per uno stile più moderno */
  font-size: 16px;
  width: 100%; /* Rendi l'input largo quanto il contenitore */
  box-sizing: border-box;
}

.btn-update, .btn-confirm, .btn-primary, .btn-secondary, .btn-danger {
  padding: 12px 20px; /* Aumenta il padding per rendere i bottoni più accessibili */
  margin-top: 10px;
  border-radius: 8px; /* Maggiore arrotondamento per i bottoni */
  cursor: pointer;
  border: none;
  font-size: 16px; /* Migliora la leggibilità */
}

.btn-update {
  background-color: #66BB6A; /* Green for update buttons */
  color: white;
}

.btn-confirm {
  background-color: #43A047; /* Darker green for confirm buttons */
  color: white;
}

.btn-primary {
  background-color: #00796B; /* Teal for primary actions */
  color: white;
}

.btn-secondary {
  background-color: #C62828; /* Red for cancel actions */
  color: white;
}

.btn-danger {
  background-color: #D32F2F; /* Dark red for dangerous actions */
  color: white;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.privacy-section {
  margin-top: 15px;
  font-size: 16px;
}

.newsletter-section {
  margin-top: 20px;
}

/* Sezione per il messaggio di avviso */
.info-box {
  display: flex;
  align-items: center;
  background-color: #FFEBEE; /* Leggero sfondo rosso per avviso */
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #E57373;
  margin-top: 15px;
}

.info-box i.icon-warning {
  font-size: 24px;
  color: #D32F2F;
  margin-right: 10px;
}

.info-box p {
  margin: 0;
  color: #D32F2F;
  font-weight: 500;
}

.privacy-section input[type="checkbox"] {
  margin-right: 10px;
}

/* Migliora la visualizzazione sui dispositivi mobili */
@media screen and (max-width: 600px) {
  .personal-area {
    padding: 15px;
  }

  .btn-update, .btn-confirm, .btn-primary, .btn-secondary, .btn-danger {
    width: 100%;
    padding: 12px 0; /* I bottoni diventano a larghezza piena sui dispositivi mobili */
    font-size: 18px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 15px;
  }
}
</style>


<script>
import AuthenticationService from '@/services/AuthenticationService';
import Utils from '@/services/apiUtils';
import emailService from '@/services/emailService';
export default {

  data(){
    return{
    selezioneNuovoNome:false,
    selezioneNuovoUsername:false,
    selezioneNuovaEmail: false,
    selezioneNuovaPassword: false,
    selezioneNuovoCompleanno: false,
    newName:'',
    newSurname:'',
    newUsername:'',
    newEmail:'',
    newPassword:'',
    newBirthday: null,
    user: {},
    username: this.$store.state.user.username,
    seguace: false
    }
  },
  methods:{
    async isSubscribed(user){
      if(user){
        this.seguace=true;
      } else{
        this.seguace=false;
      }
    },
    async fetchUser() {
        try {
          // Chiamata API per ottenere le informazioni utente
          console.log('CERCANDO UTENTE', this.username)
          const response = await Utils.getUserByUsername(this.username);  // Assicurati che questa funzione esista nel tuo servizio
          this.user = response.data;  // Salva le informazioni utente
          console.log('TROVATO UTENTE', response.data);
          await this.isSubscribed(this.user)       
        } catch (error) {
          console.error('Errore nel recupero delle informazioni utente:', error);
          this.error = 'Impossibile caricare i dati dell\'utente';
        } finally {
          this.loading = false;  // Fine del caricamento
        }
      },
    logout(){
            this.user = {};
            this.jwt = "";
            this.$store.commit('logout');
            this.$router.push("/")
        },
    async cancelNewsletter(){
      try {
        const res=await Utils.getUserByUsername(this.username);
        const user=res.data;
        const response=await emailService.cancelNewsletter(user);
        if(response.data.success){
          this.seguace=false;
          alert(response.data.message)
        } else{
          alert(response.data.message)
        }
      } catch (error) {
        console.error(error);
      }
    },
    async subscribeNewsletter(){
      try {
        const res=await Utils.getUserByUsername(this.username);
        const user=res.data;
        const response=await emailService.subscribeNewsletter(user);
        if(response.data.success){
          this.seguace=true;
          const invio= await emailService.sendWelcomeEmail(user.email)
          alert(response.data.message)
        } else{
          alert(response.data.message)
        }
      } catch (error) {
        console.error(error);
      }
    },
    update(index){
      switch (index) {
        case 0: //caso nome
          if(this.selezioneNuovoNome){
          this.selezioneNuovoNome=false;
          }
          else{
            this.selezioneNuovoNome=true;
          }
          break;
        case 1: //caso username
        if(this.selezioneNuovoUsername){
        this.selezioneNuovoUsername=false;
         }
         else{
            this.selezioneNuovoUsername=true;
         }
          break;
        case 2: //caso email
        if(this.selezioneNuovaEmail){
          this.selezioneNuovaEmail=false;
        }
        else{
          this.selezioneNuovaEmail=true;
        }
          break;
        case 3: //caso password
        if(this.selezioneNuovaPassword){
          this.selezioneNuovaPassword=false;
        }
        else{
          this.selezioneNuovaPassword=true;
        }
          break;
        case 4: //caso birthday
        if(this.selezioneNuovoCompleanno){
          this.selezioneNuovoCompleanno=false;
        }
        else{
          this.selezioneNuovoCompleanno=true;
        }
          break;      
        default:
          break;
      }
    },
    async handleDeleteAccount(){
        // Richiesta al backend per eliminare l'account
        const confirmDelete = window.confirm("Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile!");
        if (confirmDelete) {
            try {
                console.log(this.username)
                const response = await AuthenticationService.deleteAccount({"userUsername":this.username}, {headers: { Authorization: `Bearer ${this.$store.state.token}` }});
                console.log("I?M BACCCCCCCCCCCCK", response)
                if (response.data.ok) {
                    alert('Il tuo account è stato eliminato con successo.');
                    this.logout();  // Reindirizza alla pagina di logout o home
                } else {
                    alert('Si è verificato un problema nell’eliminazione dell’account.');
                }
            } catch (error) {
                console.error('Errore durante l’eliminazione dell’account:', error);
                alert('Errore di connessione. Riprova più tardi.');
            }
        }
    },
    async confermaModifica(nuovoUpdate, index){
      try {
        const response = await AuthenticationService.updatePersonalData({
          'nuovoUpdate': nuovoUpdate,
          'index':index
        }, {headers: { Authorization: `Bearer ${this.$store.state.token}` }});
        console.log('TORNATO DAL CAMBIO DATI',response.data)
        if(response.data.status){
          this.$store.dispatch('setToken', response.data.token);
          this.$store.dispatch('setUser', response.data.user);
      switch (index) {
        case 0:
          alert('Nome aggiornato con successo!')
          this.user.name=nuovoUpdate
          this.selezioneNuovoNome=false;
          this.newName='';
          break;
        case 1:
        alert('Username aggiornato con successo!')
          this.user.username=nuovoUpdate
          this.selezioneNuovoUsername=false;
          this.newUsername='';
          break;
        case 2:
        alert('Email aggiornata con successo!')
          this.user.email=nuovoUpdate
          this.selezioneNuovaEmail=false;
          this.newEmail='';
          break;
        case 3:
        alert('Password aggiornata con successo!')
          this.user.password=nuovoUpdate
          this.selezioneNuovaPassword=false;
          this.newPassword='';
          break;
        case 4:
        alert('Compleanno aggiornato con successo!')
          this.user.birthdate=nuovoUpdate;
          this.selezioneNuovoCompleanno=false;
          this.newBirthday=null;
          break;
        default:
          console.log('Ciao');
          break;
      }
    }
      } catch (error) {
        console.error('Errore con confermaNome: ', error);
      }
      

    },

    async togglePrivacy() {
      try {
        const updatedPrivacy = this.user.private;
        // Invia l'aggiornamento al backend
        const response = await AuthenticationService.updatePersonalData({
          'nuovoUpdate': updatedPrivacy,
          'index':5
        }, {headers: { Authorization: `Bearer ${this.$store.state.token}` }});

        if (response.status) {
          alert("Stato della privacy aggiornato con successo!");
        } else {
          alert("Si è verificato un errore nell'aggiornamento della privacy.");
        }
      } catch (error) {
        console.error('Errore con togglePrivacy: ', error);
      }
    },

    formatDate(date) {
        // Funzione per formattare la data in modo leggibile
        return new Date(date).toLocaleDateString();
      },

   },
   mounted(){
    this.fetchUser();
   }
}

</script>