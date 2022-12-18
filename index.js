import "https://unpkg.com/navigo"  //Will create the global Navigo object used below


import {
  setActiveLink, adjustForMissingHash, renderTemplate, loadTemplate
} from "./utils.js"

import { initBooks } from "./pages/books/books.js"
import { initEditbook } from "./pages/editBook/editBook.js"
import { initAddBook } from "./pages/addBook/addBook.js"
import { initBorrowedBooks } from "./pages/borrowedBooks/borrowedBooks.js"
import { initExceededBooks } from "./pages/exceededBooks/exceededBooks.js"
import { initAddLoan } from "./pages/addLoan/addLoan.js"


window.addEventListener("load", async () => {

  const templateAbout = await loadTemplate("./pages/about/about.html")
  const templateBooks = await loadTemplate("./pages/books/books.html")
  const templateEditBook = await loadTemplate("./pages/editBook/editBook.html")
  const templateNotFound = await loadTemplate("./pages/notFound/notFound.html")
  const templateAddBook = await loadTemplate("./pages/addBook/addBook.html")
  const templateExceededBooks = await loadTemplate("./pages/exceededBooks/exceededBooks.html")
  const templateBorrowedBooks = await loadTemplate("./pages/borrowedBooks/borrowedBooks.html")
  const templateAddLoan = await loadTemplate("./pages/addLoan/addLoan.html")
  const templateAddReservation = await loadTemplate("./pages/addReservation/addReservation.html")

  adjustForMissingHash()

  const router = new Navigo("/", { hash: true });
  //Not especially nice, BUT MEANT to simplify things. Make the router global so it can be accessed from all js-files
  window.router = router

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url)
        done()
      }
    })
    .on({
      //For very simple "templates", you can just insert your HTML directly like below
      "/": () => document.getElementById("content").innerHTML =
        `<h2>Home</h2>
      <p style='margin-top:2em'>
      This program needs a backend to work.
      Clone this project: 
      </p>
      <a href="https://github.com/Mojens/library">Github link for backend</a><br>
      <a href="https://github.com/Mojens/library_exam">Github link for Frontend</a>
     `,
      "/about": () => renderTemplate(templateAbout, "content"),

      "/books": (match) => {
        renderTemplate(templateBooks, "content")
        initBooks(match)
      },
      "/edit-book": (match) => {
        renderTemplate(templateEditBook, "content")
        initEditbook(match)
      },
      "/add-book": () => {
        renderTemplate(templateAddBook, "content")
        initAddBook()
      }, 
      "/add-loan": () => {
        renderTemplate(templateAddLoan, "content")
        initAddLoan()
      },
      "/add-reservation": () => {
        renderTemplate(templateAddReservation, "content")
      },
      "/exceeded-books": () => {
        renderTemplate(templateExceededBooks, "content")
        initExceededBooks()
      },
      "/borrowed-books": () => {
        renderTemplate(templateBorrowedBooks, "content")
        initBorrowedBooks()
      }
    })
    .notFound(() => {
      renderTemplate(templateNotFound, "content")
    })
    .resolve()
});


window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
    + ' Column: ' + column + ' StackTrace: ' + errorObj);
}