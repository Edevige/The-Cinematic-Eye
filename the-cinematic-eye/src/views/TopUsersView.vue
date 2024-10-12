<template>
  <div class="d-flex flex-column">
      <div v-for="item in userFound">
          <router-link class="d-flex flex-row" :to="'/OtherUser/'+item.Username" style="appearance: none !important; text-decoration: none;">
          <div class="col d-flex align-items-center " style="color:white"><div class="h4 m-4">{{ item.Username }}</div></div>
          </router-link>
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
        this.userFound = response.data.map(user => ({
          Username: user.Username,  // Assicurati che corrisponda al nome del campo corretto
          id: user.id
        }));
      } catch (error) {
        console.error(error);
      }
    }
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