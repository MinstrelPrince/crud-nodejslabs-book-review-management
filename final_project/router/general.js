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

// Get the book list available in the shop\
const searchAllBooks = () => {
    let booksByAuthor
    return new Promise((resolve, reject) => {
        booksByAuthor = Object.entries(books)
        if (booksByAuthor) {
            resolve(booksByAuthor)
        } else {
            reject({ message: "No books found" })
        }
    })
}
public_users.get('/', function (req, res) {
    searchAllBooks()
        .then((bks) => {
            res.status(200).send(JSON.stringify(bks, null, 4))
        })
        .catch((err) => {
            res.status(404).send(JSON.stringify(err, null, 4))
        })
});

// Get book details based on ISBN
const searchByISBN = (isbn) => {
    let booksByISBN
    return new Promise((resolve, reject) => {
        booksByISBN = books[isbn]
        if (booksByISBN) {
            resolve(booksByISBN)
        } else {
            reject({ message: "No books found" })
        }
    })
}
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    searchByISBN(isbn)
        .then((bks) => {
            res.status(200).send(JSON.stringify(bks, null, 4))
        })
        .catch((err) => {
            res.status(404).send(JSON.stringify(err, null, 4))
        })
});

const searchByAuthor = (author) => {
    let booksByAuthor
    return new Promise((resolve, reject) => {
        booksByAuthor = Object.entries(books)
            .filter(([isbn, book]) => book.author === author)
            .reduce((record, [isbn, book]) => {
                record[isbn] = book;
                return record;
            }, {});
        if (booksByAuthor) {
            resolve(booksByAuthor)
        } else {
            reject({ message: "No books found" })
        }
    })
}
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    searchByAuthor(author)
        .then((bks) => {
            res.status(200).send(JSON.stringify(bks, null, 4))
        })
        .catch((err) => {
            res.status(404).send(JSON.stringify(err, null, 4))
        })
});

// Get all books based on title
const searchByTitle = (title) => {
    let booksByTitle
    return new Promise((resolve, reject) => {
        booksByTitle = Object.entries(books)
            .filter(([isbn, book]) => book.title === title)
            .reduce((record, [isbn, book]) => {
                record[isbn] = book;
                return record;
            }, {});
        if (booksByTitle) {
            resolve(booksByTitle)
        } else {
            reject({ message: "No books found" })
        }
    })
}
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    searchByTitle(title)
        .then((bks) => {
            res.status(200).send(JSON.stringify(bks, null, 4))
        })
        .catch((err) => {
            res.status(404).send(JSON.stringify(err, null, 4))
        })
});



module.exports.general = public_users;
