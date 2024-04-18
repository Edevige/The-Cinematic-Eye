<template>
  <div class="personal-area">
    <h1>Area Personale</h1>
      <label for="name">Username: {{ this.$store.state.user.username }}</label>
      <div></div>
      <label for="email">Email: {{ this.$store.state.user.email }}</label>
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