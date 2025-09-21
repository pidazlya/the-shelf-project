the-shelf-project

**Project Overview:**  
The Shelf is a web application to manage books. Users can add, edit, delete, search, and track reading progress. Data is saved locally in the browser using LocalStorage.


---

## How It Works

### Adding a Book
1. Navigate to the **Add New Book** form on the Bookshelf page.  
2. Fill in book title, author, year, category, and optionally a cover URL.  
3. Check **Already Finished Reading** if the book is completed.  
4. Click **Add Book** → the book will appear in the **Not Yet Read** or **Finished Reading** section depending on status.  

### Viewing & Editing Books
1. Books are displayed in **Not Yet Read** and **Finished Reading** sections.  
2. Click **Edit** on a book to update information.  
3. Click **Mark as Read/Unread** to toggle completion status.  
4. Click **Delete** to remove a book (confirmation modal appears).  

### Searching Books
1. Enter a book title in the **Search Books** form.  
2. Matching books will appear dynamically below the search input.  

### Book Cover Preview
- While adding or editing a book, entering a cover URL will show a live preview of the image.

---

## Main Features
- Add, edit, and delete books.  
- Track reading progress (Not Yet Read / Finished Reading).  
- Search books by title.  
- Live book cover preview.  
- Confirmation modals for editing or deleting books.

---

## Data Structure

Books are stored in LocalStorage as objects:

```javascript
{
  id: number,          // Unique timestamp ID
  title: string,       // Book title
  author: string,      // Author name
  year: number,        // Publication year
  category: string,    // Book category
  cover: string,       // Cover URL (optional)
  isComplete: boolean  // true if finished reading
}

| Element                        | Test ID                        |
|--------------------------------|--------------------------------|
| Book form                       | `bookForm`                     |
| Title input                     | `bookFormTitleInput`           |
| Author input                    | `bookFormAuthorInput`          |
| Year input                      | `bookFormYearInput`            |
| Category input                  | `bookFormCategoryInput`        |
| Cover input                     | `bookFormImage`                |
| Cover preview image             | `imagePreview`                 |
| Completed checkbox              | `bookFormIsCompleteCheckbox`   |
| Submit book button              | `bookFormSubmitButton`         |
| Search book form                | `searchBookForm`               |
| Search input                    | `searchBookFormTitleInput`     |
| Search submit button            | `searchBookFormSubmitButton`   |
| Search results container        | `searchResults`                |
| Not Yet Read book list          | `incompleteBookList`           |
| Finished Reading book list      | `completeBookList`             |
| Individual book item            | `bookItem`                     |
| Book title in list              | `bookItemTitle`                |
| Book author in list             | `bookItemAuthor`               |
| Book year in list               | `bookItemYear`                 |
| Book category in list           | `bookItemCategory`             |
| Toggle complete button          | `bookItemIsCompleteButton`     |
| Delete book button              | `bookItemDeleteButton`         |
| Edit book button                | `bookItemEditButton`           |

## Technologies Used

- HTML5, CSS3
- JavaScript (ES6)
- LocalStorage (for data persistence)


**Author:** Marfrida Halliaputri
