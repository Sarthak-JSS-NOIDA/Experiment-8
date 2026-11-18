

const form = document.getElementById("bookForm");
const booksDiv = document.getElementById("books");
const search = document.getElementById("search");

let editId = null;
let allBooks = [];

async function loadBooks() {
  const res = await fetch("/books");
  allBooks = await res.json();
  displayBooks();
}

function displayBooks() {
  const query = search.value.toLowerCase();

  booksDiv.innerHTML = "";

  allBooks
    .filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    )
    .forEach(book => {
      const row = document.createElement("tr");

      const title = document.createElement("td");
      title.textContent = book.title;

      const author = document.createElement("td");
      author.textContent = book.author;

      const actions = document.createElement("td");

      const edit = document.createElement("button");
      edit.textContent = "Edit";
      edit.onclick = () => editBook(book);

      const del = document.createElement("button");
      del.textContent = "Delete";
      del.className = "delete";
      del.onclick = () => deleteBook(book.id);

      actions.append(edit, del);
      row.append(title, author, actions);
      booksDiv.appendChild(row);
    });
}

document.getElementById("addBtn").onclick = () => {
  editId = null;
  form.reset();
  document.getElementById("formTitle").textContent = "Add Book";
  document.getElementById("submitBtn").textContent = "Save";
  form.hidden = false;
};

document.getElementById("cancelBtn").onclick = () => {
  form.hidden = true;
};

form.onsubmit = async e => {
  e.preventDefault();

  const data = {
    title: document.getElementById("title").value,
    author: document.getElementById("author").value
  };

  await fetch(editId ? `/books/${editId}` : "/books", {
    method: editId ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  form.reset();
  form.hidden = true;
  editId = null;
  loadBooks();
};

function editBook(book) {
  editId = book.id;

  document.getElementById("title").value = book.title;
  document.getElementById("author").value = book.author;
  document.getElementById("formTitle").textContent = "Edit Book";
  document.getElementById("submitBtn").textContent = "Update";

  form.hidden = false;
}

async function deleteBook(id) {
  if (!confirm("Delete this book?")) return;

  await fetch(`/books/${id}`, { method: "DELETE" });
  loadBooks();
}

search.oninput = displayBooks;

loadBooks();
