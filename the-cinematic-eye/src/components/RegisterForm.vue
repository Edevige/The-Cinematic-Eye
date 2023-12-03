<template>
    <div>
        <form 
          name="register-form"
          autocomplete="off">
          <input type="email"
            label="Email"
            v-model="email">
          <br>
          <input
            label="Password"
            type="password"
            v-model="password"
            autocomplete="new-password"
          >
        </form>
        <br>
        <div class="danger-alert" v-html="error" />
        <br>
        <button type="button" class="btn btn-light" @click="register">Register
        </button>
    </div>
</template>

<script>
import AuthenticationService from '../services/AuthenticationService.js'

export default {
    data(){
        return{
            email: '',
            password: '',
            error: null
        }
    },
    methods:{
        async register () {
      try {
        const response = await AuthenticationService.register({
          email: this.email,
          password: this.password
        })
        this.$router.push({
          name: 'home'
        })
      } catch (error) {
        this.error = error.response.data.error
      }
    }
    }
}
</script>

<style lang="scss" scoped>
    .danger-alert{
        color:red;
        font-size: 15px;
    }
</style>