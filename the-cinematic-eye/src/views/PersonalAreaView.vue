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
}

.inside-personal-area {
  padding: 15px;
  background-color: #E8F5E9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #388E3C; /* Green tone for the title */
}

label {
  font-size: 18px;
  margin-bottom: 8px;
}

.input-group {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}

.input-text {
  padding: 8px;
  border: 1px solid #D4E6D4;
  border-radius: 5px;
  margin-top: 5px;
  font-size: 16px;
}

.btn-update, .btn-confirm, .btn-primary, .btn-secondary, .btn-danger {
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
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
</style>

<script>
import AuthenticationService from '@/services/AuthenticationService';
import Utils from '@/services/apiUtils';
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
          const response = await Utils.getUserByUsername(this.username);  // Assicurati che questa funzione esista nel tuo servizio
          this.user = response.data;  // Salva le informazioni utente
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
        const response=await Utils.cancelNewsletter(user);
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
        const response=await Utils.subscribeNewsletter(user);
        if(response.data.success){
          this.seguace=true;
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
                console.log(this.id)
                const response = await AuthenticationService.deleteAccount({"userId":this.id});
                
                if (response.ok) {
                    alert('Il tuo account è stato eliminato con successo.');
                    navigate('/logout');  // Reindirizza alla pagina di logout o home
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
        const response= await AuthenticationService.updatePersonalData({'nuovoUpdate': nuovoUpdate, 'index': index, 'id':this.id})
        
        if(response.status){
      switch (index) {
        case 0:
          this.user.name=nuovoUpdate
          this.selezioneNuovoNome=false;
          this.newName='';
          break;
        case 1:
          this.user.username=nuovoUpdate
          this.selezioneNuovoUsername=false;
          this.newUsername='';
          break;
        case 2:
          this.user.email=nuovoUpdate
          this.selezioneNuovaEmail=false;
          this.newEmail='';
          break;
        case 3:
          this.user.password=nuovoUpdate
          this.selezioneNuovaPassword=false;
          this.newPassword='';
          break;
        case 4:
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
          'id': this.user.id,
          'index':5
        });

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