<template>
  <div>
    <form name="register-form" autocomplete="off">
      <div class="mb-3">
        <label class="form-label" for="emailInput">Email</label>
        <input type="email" class="form-control text-center" id="emailInput" placeholder="email" v-model="email">
      </div>
      <div class="mb-3">
        <label class="form-label" for="passInput">Password</label>
        <input class="form-control text-center" id="passInput" type="password" placeholder="password" v-model="password"
          autocomplete="new-password">
      </div>
    </form>
    <br>
    <div v-if="error !== null" class="alert alert-danger alert-dismissible ms-5 me-5" role="alert">{{ error }}<button
        type="button" class="btn-close" @click="error = null;" aria-label="Close"></button></div>
    <br>
    <button type="button" class="btn btn-light" @click="register">Register
    </button>
  </div>
</template>

<script>
import AuthenticationService from '../services/AuthenticationService.js'

export default {
  data() {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    async register() {
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
.alert {
  font-size: large;
  font-weight: bold;
}

.form-label {
  font-size: x-large;
  color: whitesmoke;
}
</style>