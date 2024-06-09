const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter(user => 
        user.username === username
    );
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter(user => 
        user.username === username && user.password === password);
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.query.username;
    const password = req.query.password;
    if (!username || !password) {
        return res.status(400).json({message: "Error logging in"});
    }
    if (authenticatedUser(username, password)){
        let accessToken = jwt.sign({data: password}, "access", { expiresIn: 60 * 60 });
        req.session.authorization = {accessToken, username};
        return res.status(200).json({message: `User successfully logged in. Hello ${username}!`});
    } else {
        return res.status(401).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization['username'];
    if (isbn in books) {
        const reviews = books[isbn].reviews;
        if (username in reviews){
            reviews[username] = review;
            return res.status(200).json({message: "Your existing review has been successfully updated."});
        } else {
            reviews[username] = review;
            return res.status(200).json({message: "Your review has been successfully added."});
        }
    } else {
        return res.status(404).json({message: `Book with ISBN ${isbn} not exist.`});
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];
    if (isbn in books){
        const reviews = books[isbn].reviews;
        if (username in reviews){
            delete(reviews[username]);
            return res.status(200).json({message: "Your review has been successfully deleted."});
        } else {
            return res.status(404).json({message: "You have not posted review on this book."});
        }
    } else {
        return res.status(404).json({message: `Book with ISBN ${isbn} not exist.`});
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
