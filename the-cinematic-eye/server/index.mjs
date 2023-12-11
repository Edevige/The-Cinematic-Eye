import express from "express";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./models/index.mjs";
import routes from "./routes.mjs";
import config from "./config/config.mjs";

const app = express();

app.use(morgan("combined"));
app.use(express.json());
app.use(cors());

routes(app);

sequelize.sync().then(() => {
  app.listen(config.port, () => {
    console.log("Server listening on port", config.port);
  });
});
