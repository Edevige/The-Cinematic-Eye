import Authentication from "./controllers/Authentication.mjs";



export default function(app) {
    app.get("/", (_req, res) => {
        res.send({ message: "Hello there!" });
      });
      
    app.post("/register", Authentication.register);
}