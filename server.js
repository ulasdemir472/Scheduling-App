const express = require("express");
const router = require("./routes/router");
const { createTable } = require("./controllers/controller");
const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/", router);

async function startServer() {
  await createTable();
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
startServer();
