const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const cors = require("cors");
const DbConnect = require("./config/DbConnection");
const userRout = require("./routes/userRoutes");
const songRout = require('./routes/songRout')
const playlistRout = require('./routes/PlyaListRout')
const cookieParser = require("cookie-parser");

const app = express();
       
const port = process.env.port; 
app.use(cors({
  origin:"http://localhost:3000",
  credentials:true 
}))

app.use(express.json());
app.use(cookieParser());
app.use("/api", userRout);
app.use('/api',songRout)
app.use('/api',playlistRout)

DbConnect();

app.listen(port, () => {
  console.log(`your app is listening port no :${port}`);
});
