<template>
  <div class="d-flex flex-column">
      <div v-for="item in userFound">
          <div @click="goToUserArea(item.Username)">
            <div class="nome-utente">{{ item.Username }}</div>
          </div>
      </div>
  </div>
</template>

<script>
import Utils from '../services/apiUtils'
export default{

  data(){
    return{
      userFound:[]
    }
  },
  methods: {
    async fetchUser(){
      try {
        const response= await Utils.getUsers();
        this.userFound = response.data.filter(user=> user.private==false)
        .sort((a,b)=>b.seguiti - a.seguiti)
        .slice(0,10)
        .map(user => ({
          Username: user.Username,  // Assicurati che corrisponda al nome del campo corretto
          id: user.id
        }));
      } catch (error) {
        console.error(error);
      }
    },

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
  },
  mounted(){
    this.fetchUser();
  }
}

</script>

<style>
.no-style {
  appearance: none !important;
  text-decoration: none;
}
</style>