const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let review = req.query.review;
    // Check if the book with the given ISBN exists
    if (books[isbn]) {
        // Get the username from the session
        const username = req.user.username;

        // Check if the user has already posted a review for this ISBN
        if (books[isbn].reviews[username]) {
            // Modify the existing review
            books[isbn].reviews[username] = review;
            return res.status(200).json({ message: "Review modified successfully" });
        } else {
            // Add a new review
            books[isbn].reviews[username] = review;
            return res.status(200).json({ message: "Review added successfully" });
        }
    } else {
        // If the book is not found, send a 404 status
        return res.status(404).json({ message: "Book not found" });
    }
});
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;

    const username = req.user.username;

    if (books[isbn]) {
        if (books[isbn].reviews[username]) {
            delete books[isbn].reviews[username];
            return res.status(200).json({ message: "Review deleted successfully" });
        } else {
            return res.status(404).json({ message: "Review not found for the given ISBN" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
