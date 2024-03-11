import Api from '@/services/selfaApi'


export default {
  register (credentials) {
    return Api().post('register', credentials)
  },
  login (credentials) {
    return Api().post('login', credentials)
  },
  loginWithGoogleToken(credentials){
    console.log("token id da inviare: ", credentials)
    return Api().post('loginWithGoogleToken',credentials)
  },
  registerWithGoogleToken(credentials){
    return Api().post('registerWithGoogleToken', credentials)
  }
}