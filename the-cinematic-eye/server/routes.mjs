import Authentication from "./controllers/Authentication.mjs";
import AuthenticationPolicy from "./controllers/AuthenticationPolicy.mjs";
import Lists from "./controllers/Lists.mjs";
import ReviewController from "./controllers/ReviewController.mjs";
import Search from "./controllers/Search.mjs";
import SearchPolicy from "./controllers/SearchPolicy.mjs";
import UpdatesPersonalData from "./controllers/UpdatesPersonalData.mjs";
import test from "./controllers/testSeqFunc.mjs";
import ListController from "./controllers/ListController.mjs";
import RoleController from "./controllers/RoleController.mjs";
import BanController from "./controllers/BanController.mjs";
import ForumController from "./controllers/ForumController.mjs";

export default function (app) {
  app.get("/", (_req, res) => {
    res.send({ message: "Hello there!" });
  });

  app.post("/register", AuthenticationPolicy.register, Authentication.register);
  app.post("/login", AuthenticationPolicy.register, Authentication.login);
  app.post("/loginWithGoogleToken", Authentication.loginWithGoogleToken);

  app.get("/usrSrc", SearchPolicy.usrSearch, Search.usrSearch);
  app.get('/getUsers', Search.getUser);
  app.get('/getUserById/:id', Search.getUserById);
  app.get("/listSrc", SearchPolicy.usrSearch, Search.listSearch);

  app.post("/updatePersonalData", UpdatesPersonalData.updatePersonalData);

  app.get('/getUserByUsername/:username', Search.getUserByUsername);
  app.post("/addFollow", UpdatesPersonalData.addFollow);
  app.post("/rmFollow", UpdatesPersonalData.removeFollow);

  app.post("/addFavorite", UpdatesPersonalData.addFavorite);
  app.post("/rmFavorite", UpdatesPersonalData.removeFavorite);

  app.post("/addSeen", UpdatesPersonalData.addSeen);
  app.post("/rmSeen", UpdatesPersonalData.removeSeen);

  app.get("/preferiti", Lists.Preferiti);
  app.get("/filmgiavisti", Lists.FilmVisti);

  app.get("/getUserLists", ListController.getUserLists);
  app.post('/createList', ListController.createList);
  app.delete('/deleteList/:id', ListController.deleteList);
  app.post('/addFilmToList', ListController.addFilmToList);
  app.get('/getList/:id', ListController.getList);
  app.post('/removeFilmFromList', ListController.removeFilmFromList);
  app.put('/updateList/:listId', ListController.updateList);

  app.post("/addReview", ReviewController.createReview);
  app.post("/getReviews", ReviewController.getFilmReviews);
  app.get("/getUserReviews", ReviewController.getUserReviews);
  app.post('/updateReview', ReviewController.updateReview);
  app.delete('/deleteReview/:id', ReviewController.deleteReview);
  app.post('/toggleLikeDislike', ReviewController.toggleLikeDislike);
  
  app.get("/testCount", test.test);
  app.get("/testUpdatet", test.testJson);

  app.post("/emailCheck", Authentication.emailCheck);
  app.post("/deleteAccount", Authentication.deleteAccount);

  // Gestione dei ruoli
  app.get('/userrole', RoleController.getUserRole);  // Ottenere il ruolo dell'utente loggato
  app.get('/userRole/:id', RoleController.getUserRoleById);  // Ottenere il ruolo di un utente specifico
  app.post('/updateUserRole', RoleController.updateUserRole);  // Aggiornare il ruolo di un utente

  app.post('/suspendUser', RoleController.suspendUser);
  app.get('/isUserBanned/:userId', BanController.isUserBanned);
  app.post('/addUserBan', BanController.addUserBan);
  app.delete('/removeUserBan/:userId', BanController.removeUserBan);

  // Rotte per la gestione dei forum dedicati ai film
  app.post('/forum/:filmId', ForumController.getOrCreateThread);  // Ottiene o crea un thread per un film
  app.post('/forum/:threadId/addMessage', ForumController.addMessage);     // Aggiunge un messaggio a un thread
  app.get('/forum/:threadId/messages', ForumController.getMessagesByThread);
}

