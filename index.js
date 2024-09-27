const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "hiidjifjiei22";
const mongoose = require("mongoose");

const uri = "";
mongoose.connect(uri)
.then( () => {
    console.log("Connected to DB");
}).catch ((err) => {
    console.error("DB connnection error:", err);
});

const app = express();
app.use(express.json());


app.use("/signup", function(req, res) {

})

app.listen(3001);
