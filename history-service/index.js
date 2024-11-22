const express = require("express");
const bodyParser = require("body-parser");
const historyController = require("./controllers/historyController");

const app = express();
const PORT = 4000;
app.use(bodyParser.json());

app.post("/api/history", historyController.logAction);
app.get("/api/history", historyController.getHistory);

app.listen(PORT);
