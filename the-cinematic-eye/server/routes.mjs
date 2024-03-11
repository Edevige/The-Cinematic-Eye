import Authentication from "./controllers/Authentication.mjs";
import AuthenticationPolicy from "./controllers/AuthenticationPolicy.mjs";
import Search from "./controllers/Search.mjs";
import SearchPolicy from "./controllers/SearchPolicy.mjs";

export default function (app) {
  app.get("/", (_req, res) => {
    res.send({ message: "Hello there!" });
  });

  app.post("/register", AuthenticationPolicy.register, Authentication.register);
  app.post("/login", AuthenticationPolicy.register, Authentication.login);
  app.post("/loginWithGoogleToken", Authentication.loginWithGoogleToken);
  app.get("/usrSrc", SearchPolicy.usrSearch, Search.usrSearch);
}
