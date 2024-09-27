const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "hiidjifjiei22";
const mongoose = require("mongoose");
const { userModel, todoModel } = require("./db");

const uri = "";
mongoose.connect(uri)
.then( () => {
    console.log("Connected to DB");
}).catch ((err) => {
    console.error("DB connnection error:", err);
});

const app = express();
app.use(express.json());


app.post("/signup", async function(req, res) {
    const { email, password, name } = req.body;
    try{
        await userModel.create({
            email: email,
            password: password,
            name: name
        });
        res.json({ msg: "You are signup" });
    } catch(err){
        console.error("Something went wrogn", err);
    }

});

app.listen(3001);
