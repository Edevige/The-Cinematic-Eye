<template>
  <div class="d-flex flex-column">
      <div v-for="item in userFound">
          <router-link class="d-flex flex-row" :to="'/user/'+item.id" style="appearance: none !important; text-decoration: none;">
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
        response.data.forEach((i) => {
        this.userFound.push({Username: i.Username, id: i.id});
      });
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