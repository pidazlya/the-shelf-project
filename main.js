//Validator//
function isValidBook(book) {
  const valid =
    book &&
    (typeof book.id === "string" || typeof book.id === "number") &&
    typeof book.title === "string" &&
    typeof book.author === "string" &&
    typeof book.year === "number" &&
    typeof book.isComplete === "boolean";

  if (!valid) console.error("❌ Invalid book object detected:", book);
  return valid;
}
//Strorage//
function saveBooks(books) {
  if (!Array.isArray(books)) throw new Error("Books must be an array!");
  const validBooks = books.filter(isValidBook);
  if (validBooks.length < books.length) {
    console.warn("⚠️ Some books were not saved due to validation failure.");
  }
  localStorage.setItem("books", JSON.stringify(validBooks));
}

function getBooks() {
  const data = localStorage.getItem("books");
  if (!data) return [];
  try {
    const books = JSON.parse(data);
    return Array.isArray(books) ? books.filter(isValidBook) : [];
  } catch (err) {
    console.error("❌ Failed to parse books from localStorage:", err);
    return [];
  }
}

//Modal
function ensureEditModal() {
  if (!document.getElementById("editModal")) {
    const modal = document.createElement("div");
    modal.id = "editModal";
    modal.className = "modal hidden";
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Edit Book</h2>
        <form id="editBookForm">
          <input type="hidden" id="editBookId" />
          <label>Title</label><input type="text" id="editBookTitle" required />
          <label>Author</label><input type="text" id="editBookAuthor" required />
          <label>Year</label><input type="number" id="editBookYear" required />
          <label>Category</label><input type="text" id="editBookCategory" />
          <label>Cover URL</label><input type="url" id="editBookCover" />
          <div class="modal-actions">
            <button type="submit" class="btn-save">Save</button>
            <button type="button" id="closeEditModal" class="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("closeEditModal").onclick = () => {
      modal.classList.add("hidden");
    };
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  }
}

function ensureConfirmModal() {
  if (!document.getElementById("confirmModal")) {
    const modal = document.createElement("div");
    modal.id = "confirmModal";
    modal.className = "modal hidden";
    modal.innerHTML = `
      <div class="modal-content">
        <h3 id="confirmMessage">Are you sure?</h3>
        <div class="modal-actions">
          <button id="confirmYes" class="btn-save">Yes</button>
          <button id="confirmNo" class="btn-cancel">No</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const noBtn = document.getElementById("confirmNo");
    noBtn.onclick = () => modal.classList.add("hidden");
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });
  }
}

function showConfirm(message, onYes) {
  ensureConfirmModal();
  const modal = document.getElementById("confirmModal");
  const msg = document.getElementById("confirmMessage");
  const yesBtn = document.getElementById("confirmYes");

  msg.textContent = message;
  modal.classList.remove("hidden");

  yesBtn.onclick = () => { onYes(); modal.classList.add("hidden"); };
}

//BookElement

function createBookElement(book, onUpdate) {
  const bookItem = document.createElement("div");
  bookItem.classList.add("book-item");
  bookItem.setAttribute("data-bookid", book.id);
  bookItem.setAttribute("data-testid", "bookItem");

  bookItem.innerHTML = `
    ${book.cover ? `<img src="${book.cover}" alt="Cover" class="book-cover">` : ""}
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Author: ${book.author}</p>
    <p data-testid="bookItemYear">Year: ${book.year}</p>
    <p data-testid="bookItemCategory">Category: ${book.category || "-"}</p>
    <div class="book-actions">
      <button class="toggle-btn" data-testid="bookItemIsCompleteButton">${book.isComplete ? "Mark as Unread" : "Mark as Read"}</button>
      <button class="delete-btn" data-testid="bookItemDeleteButton">Delete</button>
      <button class="edit-btn" data-testid="bookItemEditButton">Edit</button>
    </div>
  `;

  // Toggle complete
  bookItem.querySelector(".toggle-btn").addEventListener("click", () => {
    showConfirm(`Are you sure to ${book.isComplete ? "mark as unread" : "mark as read"}?`, () => {
      book.isComplete = !book.isComplete;
      saveBooks(getBooks().map(b => b.id === book.id ? book : b));
      onUpdate();
    });
  });

  // Delete
  bookItem.querySelector(".delete-btn").addEventListener("click", () => {
    showConfirm("Are you sure to delete this book?", () => {
      const books = getBooks().filter(b => b.id !== book.id);
      saveBooks(books);
      onUpdate();
    });
  });

  // Edit
  bookItem.querySelector(".edit-btn").addEventListener("click", () => {
    ensureEditModal();
    const modal = document.getElementById("editModal");
    const form = document.getElementById("editBookForm");

    document.getElementById("editBookId").value = book.id;
    document.getElementById("editBookTitle").value = book.title;
    document.getElementById("editBookAuthor").value = book.author;
    document.getElementById("editBookYear").value = book.year;
    document.getElementById("editBookCategory").value = book.category || "";
    document.getElementById("editBookCover").value = book.cover || "";

    modal.classList.remove("hidden");

    form.onsubmit = (e) => {
      e.preventDefault();

      book.title = document.getElementById("editBookTitle").value.trim();
      book.author = document.getElementById("editBookAuthor").value.trim();
      book.year = parseInt(document.getElementById("editBookYear").value);
      book.category = document.getElementById("editBookCategory").value.trim();
      book.cover = document.getElementById("editBookCover").value.trim();

      if (!isValidBook(book)) { alert("❌ Invalid book data!"); return; }

      saveBooks(getBooks().map(b => (b.id === book.id ? book : b)));
      onUpdate();
      modal.classList.add("hidden");
    };
  });

  return bookItem;
}

// Render //
function renderBooks() {
  const books = getBooks();
  const incompleteShelf = document.getElementById("incompleteBookList");
  const completeShelf = document.getElementById("completeBookList");
  if (!incompleteShelf || !completeShelf) return;

  incompleteShelf.innerHTML = "";
  completeShelf.innerHTML = "";

  books.forEach(book => {
    const element = createBookElement(book, renderBooks);
    if (book.isComplete) completeShelf.appendChild(element);
    else incompleteShelf.appendChild(element);
  });
}

// form//
const bookForm = document.getElementById("bookForm");
const imageInput = document.getElementById("bookFormImage");
const imagePreview = document.getElementById("imagePreview");

if (imageInput && imagePreview) {
  imageInput.addEventListener("input", () => {
    const url = imageInput.value.trim();
    if (url) { imagePreview.src = url; imagePreview.style.display = "block"; }
    else { imagePreview.style.display = "none"; }
  });
}

bookForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const newBook = {
    id: +new Date(),
    title: document.getElementById("bookFormTitle").value.trim(),
    author: document.getElementById("bookFormAuthor").value.trim(),
    year: parseInt(document.getElementById("bookFormYear").value),
    category: document.getElementById("bookFormCategory").value.trim(),
    cover: document.getElementById("bookFormImage").value.trim(),
    isComplete: document.getElementById("bookFormIsComplete").checked
  };

  if (!isValidBook(newBook)) { alert("❌ Invalid book data!"); return; }

  const books = getBooks();
  books.push(newBook);
  saveBooks(books);

  bookForm.reset();
  if (imagePreview) imagePreview.style.display = "none";

  renderBooks();
});
// searhc //
const searchForm = document.getElementById("searchBook");
searchForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = document.getElementById("searchBookTitle").value.trim().toLowerCase();
  const resultsDiv = document.getElementById("searchResults");
  const books = getBooks();
  resultsDiv.innerHTML = "";

  books.filter(b => b.title.toLowerCase().includes(query)).forEach(book => {
    const el = createBookElement(book, renderBooks);
    resultsDiv.appendChild(el);
  });
});

// Init //
document.addEventListener("DOMContentLoaded", () => {
  renderBooks();
});
