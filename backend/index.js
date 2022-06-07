const express =require('express');
const bodyParser = require("body-parser");
const {client} = require('./db');
const { router } = require('./src/routes/routes');
var cors = require('cors')

const app = express();
app.use(cors())

const port = 3001;
const url = "localhost";
app.use(bodyParser.json());

app.use(function(req, res, next) {
    next();
});

app.use(router);

app.get("/", (req, res) => {
    res.send("merge fraiere");
})

app.listen(port, async () => {
    console.log(`Server live at: ${url}:${port}`);
})