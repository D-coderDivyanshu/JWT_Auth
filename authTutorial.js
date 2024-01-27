// Some useful extensions for rest api testing : 
// 1. rest client
// 2. thunder client

/*
    -> This is jwt(json web token) authentication tutorial
    -> In this architecture user gets an unique token, using that token only specific users can get access to to the contents
    -> Note : we can use token across different servers i.e. We can separate our authentication server from other servers (api related)
    -> we can set expiration time for access token.
    -> There is also a concept of refresh token which is used to generate new access token 
    
*/

const express = require("express");
const app = express();

// This is node module for jwt authentication
/**
 * -> For auth we need unique tokens, to generate them, there is a function in node that is "crypto".
 * -> crypto converts a random number into string and the string will be our token
 * -> run the following commands in terminal to get tokens : 
 * 
 * -> 1. node
 * -> 2. require("crypto").randomBytes(64).toString("hex")
 * 
 * -> Once you get the token define all the token in .env file that is environment file
 */
const jwt = require("jsonwebtoken");

// Loads .env file contents into process.env by default
require("dotenv").config();

/**
 * -> It is express middleware which is is used to recognize the incoming request object as a JSON object and making the data available to the req.body for further use.
 */
app.use(express.json());

const posts = [
    {
        username: "Divyanshu",
        Post: "post_01"
    },
    {
        username: "Aman",
        Post: "post_02"
    }
]

app.get("/posts", authenticateToken, (req, res) => {
    // filtering the posts by checking the username present in the posts object and user in request (user hashed with token)
    res.json(posts.filter(post => post.username === req.user.name));
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const user = { name: username };

    // process.env.ACCESS_TOKEN_SECRET : It manages token as well as user for whom the token the created
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({
        accessToken: accessToken
    })
})

function authenticateToken(req, res, next) {
    // Do not change the string "authorization"
    const authHeader = req.headers["authorization"];

    // Spliting the authorization header in two parts which was separated by space and storing the content present at index 1 in the token variable
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // Handling unauthorized access (unauthorized)
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            // Handling wrong token (forbidden)
            return res.sendStatus(403);
        }

        // Assigning the user hashed with the token as request user
        req.user = user;
        next();
    })
}

console.log("Server listening one 5000 :)");
app.listen(5000);