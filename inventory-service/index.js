const express = require("express");
const bodyParser = require("body-parser");
const inventoryController = require("./controllers/inventoryController");

const app = express();
const PORT = 3000;
app.use(bodyParser.json());

app.post("/api/products", inventoryController.createProduct);
app.post("/api/stocks", inventoryController.createStock);
app.put("/api/stocks/increase", inventoryController.increaseStock);
app.put("/api/stocks/decrease", inventoryController.decreaseStock);
app.get("/api/stocks/filter", inventoryController.getStocks);
app.get("/api/products/filter", inventoryController.getProducts);

app.listen(PORT);
