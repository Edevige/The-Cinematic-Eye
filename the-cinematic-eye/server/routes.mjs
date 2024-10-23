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
import ReportController from "./controllers/ReportController.mjs";
import PollController from "./controllers/PollController.mjs";
import emailController from "./controllers/emailController.mjs";
import path from "path";
import multer from "multer";

const fileFilter = (req, file, cb) => {
  const filetypes = /.jpg|.png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

  if (extname) {
    return cb(null, true);
  } else {
    cb('Error: Photos Only!');
  }
};

var storage = multer.diskStorage(
    {
        destination: './public/profileImg',
        fileFilter,
        filename: function ( req, file, cb ) {
            //req.body is empty...
            //How could I get the new_file_name property sent from client here?
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            
            cb( null,uniqueSuffix + path.extname(file.originalname));
        }
    }
);

const upload = multer({ storage });

export default function (app) {
  app.get("/", (_req, res) => {
    res.send({ message: "Hello there!" });
  });

  app.post("/register", AuthenticationPolicy.register, Authentication.register);
  app.post("/login", AuthenticationPolicy.register, Authentication.login);
  app.post("/loginWithGoogleToken", Authentication.loginWithGoogleToken);
  app.post("/loadImage", upload.array("files") , UpdatesPersonalData.loadImage);

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
  app.get('/getListWithOwner/:id', ListController.getListwithOwner);
  app.post('/removeFilmFromList', ListController.removeFilmFromList);
  app.put('/updateList/:listId', ListController.updateList);
  app.get('/getAllList', ListController.getAllList);
  app.post("/followList", ListController.followList);
  app.post("/unfollowList", ListController.unfollowList);

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

  app.post('/suspendUser', BanController.suspendUser);
  app.get('/isUserBanned/:userId', BanController.isUserBanned);
  app.post('/addUserBan', BanController.addUserBan);
  app.delete('/removeUserBan/:userId', BanController.removeUserBan);

  // Rotte per la gestione dei forum dedicati ai film
  app.post('/forum/:filmId', ForumController.getOrCreateThread);   // Ottiene o crea un thread per un film
  app.post('/forum/:threadId/addMessage', ForumController.addMessage);     // Aggiunge un messaggio a un thread
  app.get('/forum/:threadId/messages', ForumController.getMessagesByThread);
  app.delete('/forum/deleteMessage/:id', ForumController.deleteMessage);
  app.get('/forum/user-forums', ForumController.getUserForums);
  app.get('/fm/:id', ForumController.getForumById);
  app.post('/fm/create', ForumController.createForum);

  app.post('/createReport', ReportController.createReport);
  app.get('/reports', ReportController.getAllReports);
  app.delete('/reports/:id', ReportController.deleteReport);

  app.get('/getAllList', ListController.getAllList);
  

  app.post('/polls', PollController.createPoll); // Creazione di un nuovo sondaggio
  app.get('/polls', PollController.getAllPolls); // Recupera tutti i sondaggi
  app.post('/polls/vote', PollController.voteOnPoll); // Vota un sondaggio
  app.delete('/polls/:id', PollController.deletePoll);

  app.post('/subscribeNewsletter', emailController.subscribeNewsletter);
  app.post('/cancelNewsletter', emailController.cancelNewsletter);
  app.post('/sendWelcomeEmail', emailController.sendNewsletterEmail);
  app.post('/isUserSuspended', BanController.isUserSuspended);
  app.post('/isUserSuspendedGoogle', BanController.isUserSuspendedGoogle);
}