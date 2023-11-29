import express from "express";
import cors from "cors";
import morgan from "morgan";

const port = 3000;

const app = express();

app.use(morgan("combined"));
app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send({ message: "Hello there!" });
});

app.listen(port, () => {
  console.log("Server listening on port", port);
});
