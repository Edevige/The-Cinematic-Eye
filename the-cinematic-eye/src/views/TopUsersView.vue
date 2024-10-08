<template>
  <div class="d-flex flex-column">
      <div v-for="item in userFound">
          <router-link class="d-flex flex-row" :to="'/user/'+item.id" style="appearance: none !important; text-decoration: none;">
          <div class="col d-flex align-items-center " style="color:white"><div class="h4 m-4">{{ item.username }}</div></div>
          </router-link>
      </div>
  </div>
</template>

<script>

import Users from '../../server/models/Users.mjs'

export default{

  data(){
    return{
      userFound:[]
    }
  },
  /*methods: {
    async fetchUser(){
      try {
        const response= await Users.findAll();
        this.userFound=response.data;
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }
  },
  mounted(){
    this.fetchUser();
  }*/
}

</script>