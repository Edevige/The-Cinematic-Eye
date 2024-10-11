import Api from '@/services/selfaApi'


export default {
    addFavorite (credentials) {
        return Api().post('/addFavorite', credentials)
    },
    rmFavorites  (credentials) {
        return Api().post('/rmFavorite', credentials)
    },
    addSeen (credentials) {
        return Api().post('/addSeen', credentials)
    },
    rmSeen  (credentials) {
        return Api().post('/rmSeen', credentials)
    },
    createReview (credentials) {
        return Api().post('/addReview', credentials)
    },
    getReviews (credentials) {
        return Api().post('/getReviews', credentials)
    },
    getUserReviews(credentials) {
        return Api().get('/getUserReviews', credentials);
    },
    updateReview (reviewData, credentials) {
        return Api().post('/updateReview', reviewData, credentials);
    },
    deleteReview (reviewId, credentials) {
        return Api().delete(`/deleteReview/${reviewId}`, credentials);
    },
    toggleLikeDislike(credentials) {
        return Api().post('/toggleLikeDislike', credentials);
    },
    getUserLists(credentials) {
        return Api().get('/getUserLists', credentials);
    },
    addFilmToList(credentials) {
        return Api().post('/addFilmToList', credentials);
    },
    getUsers(credentials) {
        return Api().get('/getUsers', credentials);
    },
    getUserById(id){
        return Api().get(`/getUserById/${id}`);
    },
    getList(listId) {
        return Api().get(`/getList/${listId}`); 
    },
    removeFilmFromList(credentials) {
        return Api().post('/removeFilmFromList', credentials);
    },
    updateList(listId, data) {
        return Api().put(`/updateList/${listId}`, data); 
    },
    getUserByUsername(username) {
        return Api().get(`/getUserByUsername/${username}`);
    },
    toggleFollowUser(username, action, token) {
        return Api().post('/toggleFollowUser', {
          username: username,
          action: action
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    
}