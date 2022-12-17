import "https://unpkg.com/navigo"  //Will create the global Navigo object used below


import {
  setActiveLink, adjustForMissingHash, renderTemplate, loadTemplate
} from "./utils.js"

import { initNavigate } from "./pages/navigate/navigate.js"
import { showMatchObject } from "./pages/show-match/match.js"
import { initBooks } from "./pages/books/books.js"
import { initFindUser } from "./pages/findUser/findUser.js"
import { initEditUser } from "./pages/editUser/editUser.js"
import { initAddBook } from "./pages/addBook/addBook.js"

window.addEventListener("load", async () => {

  const templateAbout = await loadTemplate("./pages/about/about.html")
  const templateBooks = await loadTemplate("./pages/books/books.html")
  const templateFindUser = await loadTemplate("./pages/findUser/findUser.html")
  const templateEditUser = await loadTemplate("./pages/editUser/editUser.html")
  const templateNavigate = await loadTemplate("./pages/navigate/navigate.html")
  const templateMatch = await loadTemplate("./pages/show-match/match.html")
  const templateNotFound = await loadTemplate("./pages/notFound/notFound.html")
  const templateAddBook = await loadTemplate("./pages/addBook/addBook.html")

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
      This is the content of the Home Route
      </p>
     `,
      "/about": () => renderTemplate(templateAbout, "content"),

      "/books": () => {
        renderTemplate(templateBooks, "content")
        initBooks()
      },
      "/find-user": (match) => {
        renderTemplate(templateFindUser, "content")
        initFindUser(match)
      },
      "/edit-user": (match) => {
        renderTemplate(templateEditUser, "content")
        initEditUser(match)
      },
      "/add-book": () => {
        renderTemplate(templateAddBook, "content")
        initAddBook()
      },

      "/navigate-programatically": () => {
        renderTemplate(templateNavigate, "content")
        initNavigate()
      },

      "/show-match": (match) => {
        renderTemplate(templateMatch, "content")
        showMatchObject(match)
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