import Api from '@/services/selfaApi'


export default {
  register (credentials) {
    return Api().post('register', credentials)
  },
  login (credentials) {
    return Api().post('login', credentials)
  },
  loginWithGoogleToken(id_token){
    return Api().post('loginWithGoogleToken',id_token)
  }
}