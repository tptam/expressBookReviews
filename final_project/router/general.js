const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res
        .status(200)
        .json({ message: `User successfully registered. Hello ${username}!` });
    } else {
      return res.status(409).json({ message: "Username already exist." });
    }
  } else {
    return res
      .status(400)
      .json({ message: "Username and/or password not given." });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((result) => {
      res.status(200).json(result);
    })
    .then(() => console.log("Task 10 with Promise callbacks"));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((result) => {
      if (isbn in result) {
        return res.status(200).json(result[isbn]);
      } else {
        return res
          .status(404)
          .json({ message: `Book with ISBN ${isbn} not exist.` });
      }
    })
    .then(() => console.log("Task 11 with Promise callbacks"));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((result) => {
      const filtered_books = Object.values(result).filter(
        (book) => book.author == author,
      );
      if (filtered_books.length > 0) {
        return res.status(200).json(filtered_books);
      } else {
        return res
          .status(404)
          .json({ message: `Book by ${author} not found.` });
      }
    })
    .then(() => console.log("Task 12 with Promise callbacks"));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((result) => {
      const filtered_books = Object.values(result).filter(
        (book) => book.title == title,
      );
      if (filtered_books.length > 0) {
        return res.status(200).json(filtered_books);
      } else {
        return res
          .status(404)
          .json({ message: `Book under the title "${title}" not found.` });
      }
    })
    .then(() => console.log("Task 13 with Promise callbacks"));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (isbn in books) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res
      .status(404)
      .json({ message: `Book with ISBN ${isbn} not exist.` });
  }
});

module.exports.general = public_users;
