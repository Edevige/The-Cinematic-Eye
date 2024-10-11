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
    //funzione per aggiungere un film alla lista 
    addFilmToList(credentials) {
        return Api().post('/addFilmToList', credentials);
    },
    //funzione per ottenere i dati dell'utente loggato
    getUsers(credentials) {
        return Api().get('/getUsers', credentials);
    },
    //funzione per ottenre i dati utente dall'id
    getUserById(id){
        return Api().get(`/getUserById/${id}`);
    },
    //funzione per ottenere i dati di una lista
    getList(listId) {
        return Api().get(`/getList/${listId}`); 
    },
    //funzione per rimuovere un film da una lista
    removeFilmFromList(credentials) {
        return Api().post('/removeFilmFromList', credentials);
    },
    //funzione per aggiornare i dati relativi a una listafilm (titolo e visibilità)
    updateList(listId, data) {
        return Api().put(`/updateList/${listId}`, data); 
    },
    //funzione per ottenere i dati utente dall'username
    getUserByUsername(username) {
        return Api().get(`/getUserByUsername/${username}`);
    },
    //funzione per aggiungere un follow
    addFollow (credentials) {
        return Api().post('/addFollow', credentials)
    },
    //funzione per rimuovere un follow
    rmFollow  (credentials) {
        return Api().post('/rmFollow', credentials)
    },
    // Funzione per aggiornare il ruolo dell'utente
    updateUserRole(credentials) {
        return Api().post('/updateUserRole', credentials);
    },
    // Funzione per ottenere il ruolo di un utente specifico
    getUserRoleById(userId) {
        return Api().get(`/userRole/${userId}`);
    },
    // Funzione per ottenere il ruolo dell'utente loggato
    getUserRole(credentials) {
        return Api().get('/userrole', credentials);
    }
    
}