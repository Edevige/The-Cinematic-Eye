import Api from '@/services/selfaApi'


export default {
  register (credentials) {
    return Api().post('register', credentials)
  },
  login (credentials) {
    return Api().post('login', credentials)
  },
  loginWithGoogleToken(credentials){
    return Api().post('loginWithGoogleToken',credentials)
  },
  registerWithGoogleToken(credentials){
    return Api().post('registerWithGoogleToken', credentials)
  },
  updatePersonalData(data, config){
    return Api().post('updatePersonalData', {data}, config)
  },
  emailCheck(credentials){
    return Api().post('emailCheck', credentials)
  },
  resetPassword(credentials){
    return Api().post('resetPassword', credentials)
  },
  deleteAccount(credentials, config){
    return Api().post('deleteAccount', {credentials}, config)
  },
  
}