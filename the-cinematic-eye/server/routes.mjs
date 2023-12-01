export default function(app) {
    app.get("/", (_req, res) => {
        res.send({ message: "Hello there!" });
      });

}