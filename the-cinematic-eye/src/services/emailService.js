import Api from '@/services/selfaApi';
export default {
  
  subscribeNewsletter(credentials){
    return Api().post('/subscribeNewsletter', credentials);
  },
  cancelNewsletter(credentials){
      return Api().post('/cancelNewsletter', credentials);
  },
  sendWelcomeEmail(credentials){
    return Api().post('/sendWelcomeEmail', credentials);
  }

}

