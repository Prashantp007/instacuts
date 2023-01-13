const express = require('express');
const app = express();
const bodyParser = require('body-parser')
require('dotenv').config();
require('./models/index')
const PORT = process.env.PORT;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const clientRouter = require('./routers/clientRouter');
app.use('/client', clientRouter);

app.get("/", (req, res) => res.send("home page...."))
    .listen(PORT, () => console.log(`Server is up and running on ${PORT} ...`));