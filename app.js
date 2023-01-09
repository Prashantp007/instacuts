const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;

app.get("/",(req, res)=>res.send("home page...."))
.listen(PORT,()=>console.log(`server is up and running on ${PORT}`))