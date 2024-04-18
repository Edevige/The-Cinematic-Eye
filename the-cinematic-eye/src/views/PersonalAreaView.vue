<template>
  <div class="personal-area">
    <h1>Area Personale</h1>
      <label for="Usernam">Username: {{ this.$store.state.user.username }}</label>
      <div></div>
      <label for="Email">Email: {{ this.$store.state.user.email }}</label>
      <div></div>
      <label for="Name">Nome: {{ this.$store.state.user.name }}</label>
      <div></div>
      <div v-if="this.$store.state.user.birthday">
      <label for="Birthday">Compleanno: {{ this.$store.state.user.birthday }}</label>
      </div>
      <div v-if="!this.$store.state.user.birthday">
      <label for="Birthday">Non hai inserito il tuo Compleanno</label>
      <button type="button" @click="updateBirthday()">Aggiorna Data</button>
      </div>
      <div></div>
      <div v-if="this.$store.state.user.subscribed">
      <label for="Newsletter">Sei iscritto alla newsletter</label>
      <button type="button" @click="cancelNewsletter()">Cancella l'iscrizione</button>
      </div>
      <div v-if="!this.$store.state.user.subscribed">
      <label for="Newsletter">Non sei iscritto alla newsletter</label>
      <button type="button" @click="subscribeNewsletter()">Iscriviti</button>
      </div>
      <div></div>
      <button type="button" @click="logout()">Logout</button>
  </div>
</template>

<script>

export default {
   methods:{
    logout(){
            this.user = {};
            this.jwt = "";
            this.$store.commit('logout');
            this.$router.push("/")
        }
   }
}

</script>