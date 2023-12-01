import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes.mjs";

const port = 3000;

const app = express();

app.use(morgan("combined"));
app.use(express.json());
app.use(cors());


routes(app);

app.listen(port, () => {
  console.log("Server listening on port", port);
});
