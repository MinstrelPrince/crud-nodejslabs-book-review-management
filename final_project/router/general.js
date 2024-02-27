const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    } else {
        return res.status(404).json({ message: "Username and Password required!" });
    }
});

// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//     res.send(JSON.stringify(books, null, 4));
// });
// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    return new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify(books, null, 4)));
    });
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//     const isbn = req.params.isbn;
//     let book = books.filter(x => x.isbn === isbn)
//     res.send(book)
// });
public_users.get('/isbn/:isbn', async function (req, res) {
    return new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        let book = books.filter(x => x.isbn === isbn)
        if (book) {
            resolve(
                res.send(book)
            );
        } else {
            reject(res.status(208).json({ message: "book not found" }))
        }

    });

});

// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     const author = req.params.author;
//     let book = books.filter(x => x.author === author)
//     res.send(book)
// });
public_users.get('/author/:author', async function (req, res) {
    return new Promise((resolve, reject) => {
        const author = req.params.author;
        let book = books.filter(x => x.author === author)
        if (book) {
            resolve(
                res.send(book)
            );
        } else {
            reject(res.status(208).json({ message: "book not found" }))
        }

    });
});

// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     const title = req.params.title;
//     let book = books.filter(x => x.title === title)
//     res.send(book)
// });
public_users.get('/title/:title', function (req, res) {
    return new Promise((resolve, reject) => {
        const title = req.params.title;
        let book = books.filter(x => x.title === title)
        if (book) {
            resolve(
                res.send(book)
            );
        } else {
            reject(res.status(208).json({ message: "book not found" }))
        }

    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let book = books.filter(x => x.isbn === isbn)
    let reviews = book.reviews;
    res.send(book["reviews"])
});

module.exports.general = public_users;
