import { SERVER_URL as URL } from "../../settings.js"
//Add id to this URL to get a single book

export async function initEditbook(match) {

    document.getElementById("edit-form").onsubmit = editbook;
    document.getElementById("btn-fetch-book").onclick = fetchbookData
    if (match?.params?.id) {
        const id = match.params.id
        try {
            renderbook(id)
        } catch (err) {
            document.getElementById("error").style.display = "block"
            document.getElementById("error").innerText = "Could not find book: " + id
        }
    }
    document.getElementById("book-id-input").value = ""
}

async function fetchbookData() {
    document.getElementById("error").innerText = ""
    const id = document.getElementById("book-id-input").value
    if (!id) {
        document.getElementById("error").innerText = "Please provide an id"
        return
    }
    try {
        renderbook(id)
        window.router.navigate("edit-book?id=" + id)
    } catch (err) {
        console.log("UPS " + err.message)
    }
}

async function renderbook(id) {
    try {
        const book = await fetch(URL + "/" + id).then(res => res.json())
        if (Object.keys(book).length === 0) {  //checks for an empty object = {}
            throw new Error("No book found for id:" + id)
        }
        document.getElementById("id").innerHTML = "<b>Book</b> to edit with Id: " + book.id;
        document.getElementById("book-id-input").value = book.id;
        document.getElementById("title-edit-input").value = book.title;
        document.getElementById("author-edit-input").value = book.author;
        document.getElementById("isbn-edit-input").value = book.isbn;
        document.getElementById("publisher-edit-input").value = book.publisher;
        document.getElementById("publish-year-edit-input").value = book.publishYear;

    } catch (err) {
        document.getElementById("error").innerText = err
    }
}

async function editbook() {
    document.getElementById("error").innerText = ""
    const id = document.getElementById("book-id-input").value
    const title = document.getElementById("title-edit-input").value
    const author = document.getElementById("author-edit-input").value
    const isbn = document.getElementById("isbn-edit-input").value
    const publisher = document.getElementById("publisher-edit-input").value
    const publishYear = document.getElementById("publish-year-edit-input").value

    const book = {
        title: title,
        author: author,
        isbn: isbn,
        publisher: publisher,
        publishYear: publishYear
    }
    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(book)
    }
    try {
        const response = await fetch(URL + "/" + id, options).then(res => res.json())
        if (response.status === 200) {
            document.getElementById("error").innerText = "book updated successfully"
            window.router.navigate("books")

        }
    } catch (err) {
        document.getElementById("error").innerText = err
    }
}