import Authentication from "./controllers/Authentication.mjs";
import AuthenticationPolicy from "./controllers/AuthenticationPolicy.mjs";
import Search from "./controllers/Search.mjs";
import SearchPolicy from "./controllers/SearchPolicy.mjs";
import UpdatesPersonalData from "./controllers/UpdatesPersonalData.mjs";
import test from "./controllers/testSeqFunc.mjs/index.js";

export default function (app) {
  app.get("/", (_req, res) => {
    res.send({ message: "Hello there!" });
  });

  app.post("/register", AuthenticationPolicy.register, Authentication.register);
  app.post("/login", AuthenticationPolicy.register, Authentication.login);
  app.post("/loginWithGoogleToken", Authentication.loginWithGoogleToken);
  app.get("/usrSrc", SearchPolicy.usrSearch, Search.usrSearch);
  app.post("/updatePersonalData", UpdatesPersonalData.updatePersonalData);
  app.get("/testCount", test.test);
}
