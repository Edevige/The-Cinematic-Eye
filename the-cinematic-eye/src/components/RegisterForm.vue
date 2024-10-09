<template>
  <div>
    <form name="register-form" autocomplete="off">
      <div class="mb-3">
        <label class="form-label" for="emailInput">Email*</label>
        <input type="email" class="form-control text-center" id="emailInput" placeholder="email" v-model="email">
      </div>
      <div class="mb-3">
        <label class="form-label" for="passInput">Password*</label>
        <input class="form-control text-center" id="passInput" type="password" placeholder="password" v-model="password"
          autocomplete="new-password" @paste.prevent @copy.prevent>
      </div>
      <div class="mb-3">
        <label class="form-label" for="cpassInput">Confirm Password*</label>
        <input class="form-control text-center" id="cpassInput" type="password" placeholder="password" v-model="cpassword"
        @paste.prevent @copy.prevent>
      </div>
      <div class="mb-3">
        <label class="form-label" for="userInput">Username*</label>
        <input class="form-control text-center" id="userInput" type="text" placeholder="Username" v-model="username"
          minlength="2" maxlength="16">
      </div>
      <div class="mb-3">
        <label class="form-label" for="nameInput">Full Name</label>
        <input class="form-control text-center" id="nameInput" type="text" placeholder="Full Name" v-model="name">
      </div>
      <div class="mb-3">
        <label class="form-label" for="dateInput">Birthdate</label>
        <input class="form-control text-center" id="dateInput" type="date" v-model="birthdate">
      </div>
      <div class="mb-3" style="color: whitesmoke">
        <input id="termsAgree" type="checkbox" v-model="termsCheck" class="me-2" />I Agree with <div onmouseover="" @click="(newTab('terms'))"
          style="color:lightskyblue; cursor: pointer;">The Cinematic Eye Terms</div>
      </div>
      <div class="mb-3" style="color: whitesmoke">
        <input id="newsletter" type="checkbox" v-model="subCheck" class="me-2" />I want to subscribe to the TCE Newsletter
      </div>
    </form>
    <br>
    <div v-if="error !== null" class="alert alert-danger alert-dismissible ms-5 me-5" role="alert">{{ error }}<button
        type="button" class="btn-close" @click="error = null;" aria-label="Close"></button></div>

    <br>
    <button :disabled="!termsCheck" type="button" class="btn btn-light" @click="register">Register
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
      cpassword: '',
      username: '',
      name: '',
      birthdate: '',
      subCheck: true,
      error: null,
      termsCheck: false
    }
  },
  methods: {
    async register() {

      if (this.password != this.cpassword) {
        this.error = "Passwords doesn't match"
      }
      else {
        const authObj = {};
        authObj.email = this.email;
        authObj.password = this.password;
        authObj.subscribed = this.subCheck;
        if (this.name != '') authObj.name = this.name;
        if (this.username != '') authObj.username = this.username;
        if (this.birthdate != '') authObj.birthdate = this.birthdate;
        try {
          const response = await AuthenticationService.register(authObj);
          this.$store.dispatch('setToken', response.data.token)
          this.$store.dispatch('setUser', response.data.user)
          this.$store.commit('login')
          this.$router.push({
            name: 'home'
          })
        } catch (error) {
          this.error = error.response.data.error
        }
      }
    },
    newTab(routeName){
      const routeData = this.$router.resolve({name: routeName});
      window.open(routeData.href, '_blank', "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
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