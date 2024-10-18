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
    //
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
    },
    // Funzione per verificare se un utente è bannato
    isUserBanned(userId) {
        return Api().get(`/isUserBanned/${userId}`);
    },
    // Funzione per aggiungere un ban
    addUserBan(credentials) {
        return Api().post('/addUserBan', credentials);
    },
    // Funzione per rimuovere un ban
    removeUserBan(userId, credentials) {
        return Api().delete(`/removeUserBan/${userId}`, credentials);
    },
    // Funzione per creare una nuova lista
    createList(listData, credentials) {
        return Api().post('/createList', listData, credentials);
    },
    //funzione per eliminare una lista utente
    deleteList(listId, config) {
        return Api().delete(`/deleteList/${listId}`, config);
    },
    // Funzione per ottenere o creare il thread dedicato a un film
    getOrCreateThread(credentials) {
        return Api().post(`/forum/${credentials.filmId}`, credentials);
    },
    // Funzione per ottenere i messaggi di un thread
    getMessagesByThread(threadId) {
        return Api().get(`/forum/${threadId}/messages`);
    },      
    // Funzione per aggiungere un messaggio a un thread
    addMessage(messageData) {
        return Api().post(`/forum/${messageData.threadId}/addMessage`, messageData); // Usa threadId nell'URL
    },
    deleteMessage (messageId, credentials) {
        return Api().delete(`/forum/deleteMessage/${messageId}`, credentials);
    },
    getUserForums() {
        return Api().get('/forum/user-forums');
    },
    getForumById(forumId) {
        return Api().get(`/fm/${forumId}`);
    },
    // Funzione per creare un nuovo forum con film_id=null
    createForum(credentials) {
        return Api().post('/fm/create', credentials);
    },
    createReport(credentials) {
        return Api().post('/createReport', credentials);
    },
    getReports() {
        return Api().get('/reports');
    },
    // Funzione per eliminare un report
    deleteReport(reportId) {
        return Api().delete(`/reports/${reportId}`);
    },
    getAllList(credentials){
        return Api().get('/getAllList',credentials);
    },
    followList(listId, config){
        return Api().post('/followList', {listId: listId}, config);
    },
    unfollowList(listId, config){
        return Api().post('/unfollowList', {listId: listId}, config);
    },
    
    getPolls() {
        return Api().get('/polls');
    },
    // Crea un nuovo sondaggio
    createPoll(pollData) {
        return Api().post('/polls', pollData);
    },
    // Vota un sondaggio
    voteOnPoll(voteData) {
        return Api().post('/polls/vote', voteData);
    },
    deletePoll(pollId) {
        return Api().delete(`/polls/${pollId}`);
    },

    
}