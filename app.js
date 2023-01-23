const express = require('express');
const app = express();
const bodyParser = require('body-parser')
require('dotenv').config();
require('./models/index')
const PORT = process.env.PORT;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument  = require('./swagger/swagger.json');


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const clientRouter = require('./routers/clientRouter');
const serviceProvider = require('./routers/serviceProviderRouter');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/client', clientRouter);
app.use('/serviceProvider', serviceProvider);

app.get("/", (req, res) => res.send("home page...."))
    .listen(PORT, () => console.log(`Server is up and running on ${PORT} ...`));