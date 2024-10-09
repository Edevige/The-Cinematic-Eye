import Authentication from "./controllers/Authentication.mjs";
import AuthenticationPolicy from "./controllers/AuthenticationPolicy.mjs";
import Lists from "./controllers/Lists.mjs";
import ReviewController from "./controllers/ReviewController.mjs";
import Search from "./controllers/Search.mjs";
import SearchPolicy from "./controllers/SearchPolicy.mjs";
import UpdatesPersonalData from "./controllers/UpdatesPersonalData.mjs";
import test from "./controllers/testSeqFunc.mjs";
import ListController from "./controllers/ListController.mjs";

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

  app.post("/updatePersonalData", UpdatesPersonalData.updatePersonalData);

  app.post("/addFavorite", UpdatesPersonalData.addFavorite);
  app.post("/rmFavorite", UpdatesPersonalData.removeFavorite);

  app.post("/addSeen", UpdatesPersonalData.addSeen);
  app.post("/rmSeen", UpdatesPersonalData.removeSeen);

  app.get("/watchlist", Lists.watchList);
  app.get("/filmgiavisti", Lists.FilmVisti);

  app.get("/getUserLists", ListController.getUserLists);
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
}

