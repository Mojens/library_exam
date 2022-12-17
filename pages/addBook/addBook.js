import { SERVER_URL as URL } from "../../settings.js"

export async function initAddBook() {

    document.getElementById("create-form").onsubmit = addUser

}


async function addUser() {
    const title = document.getElementById("title-create-input").value;
    const author = document.getElementById("author-create-input").value;
    const publisher = document.getElementById("publisher-create-input").value;
    const isbn = document.getElementById("isbn-create-input").value;
    const publishYear = document.getElementById("publish-year-create-input").value;

    const book = {
        title : title,
        author : author,
        publisher : publisher,
        isbn : isbn,
        publishYear : publishYear
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(book)
    }
    try {
        const response = await fetch(URL, options).then(res => res.json())
        if (response.status === 200) {
            window.router.navigate("books")
        }
    } catch (err) {
        console.log("UPS " + err.message)
    }
}



