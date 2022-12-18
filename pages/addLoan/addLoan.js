import { SERVER_URL, SERVER_URL as URL } from "../../settings.js"

export async function initAddLoan() {
    document.getElementById("create-loan-btn").onclick = addLoan
    getAllMembers()
    getAllBooks()
}



async function getAllMembers() {
    const members = await fetch(URL + "/members/").then(res => res.json())
    const memberOptions = members.map(member => `<option value="${member.id}">${member.userName}, ${member.email}</option>`)
    document.getElementById("add-loan-members").innerHTML = memberOptions.join("\n")
}
async function getAllBooks() {
    const books = await fetch(URL).then(res => res.json())
    const bookOptions = books.map(book => `<option value="${book.id}">${book.title}, ${book.author}, ${book.publishYear}</option>`)
    document.getElementById("add-loan-books").innerHTML = bookOptions.join("\n")

}
function getSelectedBooks() {
    let books = document.getElementById("add-loan-books")
    let selectedBooks = Array.from(books.options).filter(function
        (option) {
        return option.selected
    }).map(function (option) {
        return option.value
    });
    return selectedBooks
}

async function addLoan(){

    const loan = {
        bookIds: getSelectedBooks(),
        memberId: document.getElementById("add-loan-members").value,
        returnDate : document.getElementById("return-loan-date").value,
        dueDate : document.getElementById("due-loan-date").value,
        checkoutDate : document.getElementById("check-out-loan-date").value
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loan)
    }
    const response = await fetch(URL + "/loan", options).then(res => res.json())
    if(response.loanId !== undefined){
        document.getElementById("error").innerHTML = ""
        document.getElementById("succes").innerHTML = "Loan created successfully"
    }else if(response.status === 500){
        document.getElementById("succes").innerHTML = ""
        document.getElementById("error").innerHTML = response.message
    }
    console.log(response)
}