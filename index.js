const express = require('express');
const cookieParser = require('cookie-parser');
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
app.use(cookieParser());


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

app.post("/signin", async function(req, res) {
    const { email, password } = req.body;
    try{
        const user = await userModel.findOne({
            email: email,
            password: password
        });
        if(user) {
            const token = jwt.sign({
                id: user._id
            }, JWT_SECRET);

            res.cookie(
                'token', token, {
                    httpOnly: true,
                    secure: req.secure || false,    // Set to true if HTTPS (can be managed dynamically)
                    maxAge: 60 * 60 * 1000  // Token expires in 1 hr
                });
            res.json({
                msg: "logged in"
            })
        }
    } catch(err){
        console.error("Something went wrong", err);
    }
});

function auth(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            msg: "Unauthorized"
        });
    } 
    try{
        const decodedData = jwt.verify(token, JWT_SECRET);
        req.userId = decodedData.id;
        next();
    } catch(err){
        console.error("Something went wrogn", err);
    }
}

app.get("/users", auth, async function(req, res) {
    try {
        const users = await userModel.find({});
        if (!users.length) {
            return res.status(404).json({ 
                msg: "No users found"
             }); // Handle no users case
        }
        res.json({
            users: users
        });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ 
            msg: "Internal Server Error"
         }); // Handle database error
    }
});

app.post("/logout", auth, function(req, res) {
    res.clearCookie('token');
    res.json({
        msg: "Logout successfully"
    });
});

app.listen(3001);
