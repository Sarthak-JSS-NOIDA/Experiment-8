

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let books = [];
let id = 1;

// Get all books
app.get("/books", (req, res) => {
  res.json(books);
});

// Add book
app.post("/books", (req, res) => {
  const book = { id: id++, ...req.body };
  books.push(book);
  res.status(201).json(book);
});

// Update book
app.put("/books/:id", (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));

  if (!book) return res.status(404).json({ message: "Not found" });

  book.title = req.body.title;
  book.author = req.body.author;

  res.json(book);
});

// Delete book
app.delete("/books/:id", (req, res) => {
  books = books.filter(b => b.id !== Number(req.params.id));
  res.json({ message: "Book deleted" });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
