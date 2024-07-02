const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const cors = require("cors");
const DbConnect = require("./config/DbConnection");

const app = express();

const port = process.env.port;

app.use(express.json())

DbConnect();

app.listen(port, () => {
  console.log(`your app is listening port no :${port}`);
});
