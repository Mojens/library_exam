import { SERVER_URL, SERVER_URL as URL } from "../../settings.js"
import { sanitizeStringWithTableRows, handleHttpErrors } from "../../utils.js"


export function initBooks(match) {
  document.getElementById("tbl-body").onclick = showbookDetails
  document.getElementById("exampleModal").onclick = showbookDetails
  document.getElementById("find-book-btn").onclick = findBookById
  document.getElementById("get-all-book-btn").onclick = getAllbooks
  if (match?.params?.id) {
    const id = match.params.id
    try {
        renderBook(id)
        window.router.navigate("books?id=" + id)
    } catch (err) {
        document.getElementById("error").style.display = "block"
        document.getElementById("error").innerText = "Could not find book: " + id
    }
    if(match?.params?.id === "all"){
      getAllbooks()
    }
}
document.getElementById("find-book-id").value = ""
}

export async function getAllbooks() {
  try {
    const booksFromServer = await fetch(URL).then(res => res.json())
    showAllData(booksFromServer)
    window.router.navigate("books?id=all")
  }
  catch (err) {
    console.error("UPPPPPS: " + err) //This can be done better
  }
}

function showAllData(data) {
  const tableRowsArray = data.map(book => `
  <tr>                                
    <td>${book.id} </td>              
    <td>${book.title} </td>                     
    <td>${book.author}</td>  
    <td>${book.publisher}</td>
    <td>${book.publishYear}</td>
    <td><button id="${book.id}-column-id" type="button"  class="btn btn-sm btn-dark" data-bs-toggle="modal" data-bs-target="#exampleModal">Details</button></td>      
  </tr>`)

  const tableRowsString = tableRowsArray.join("\n")
  document.getElementById("tbl-body").innerHTML = sanitizeStringWithTableRows(tableRowsString)
}

async function showbookDetails(evt) {
  const target = evt.target
  if (!target.classList.contains("btn")) return
  const id = target.id.replace("-column-id", "")
  document.getElementById("exampleModalLabel").innerText = "Details for Book: " + id
  const book = await fetch(URL + "/" + id).then(res => res.json())
  document.getElementById("all-book-footer").innerHTML = `
    <button type="button" class="other-page btn btn-dark other-page" data-bs-dismiss="modal" id="${id}-edit-book">Rediger</button>
    <button type="button" class="delete-book-button btn btn-dark" data-bs-dismiss="modal" id="${id}-delete-book">Delete book</button>
    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
    `
  if (target.classList.contains("other-page")) {
    const id = target.id.replace("-edit-book", "")
    window.router.navigate("edit-book?id=" + id)
  }

  document.getElementById("status-modal-dot").style.backgroundColor = "green"
  document.getElementById("loan-info").style.display = "none"
  document.getElementById("reservation-info").style.display = "none"
  document.getElementById("member-info").style.display = "none"

  document.getElementById("book-title-modal").innerHTML = "<b>Title: </b>" + book.title
  document.getElementById("book-author-modal").innerHTML = "<b>Author: </b>" + book.author
  document.getElementById("book-publisher-modal").innerHTML = "<b>publisher: </b>" + book.publisher
  document.getElementById("book-publish-year-modal").innerHTML = "<b>Publish Year: </b>" + book.publishYear
  document.getElementById("book-isbn-modal").innerHTML = "<b>isbn: </b>" + book.isbn
  if (book.loan != null) {
    document.getElementById("status-modal-dot").style.backgroundColor = "#8b0000"
    document.getElementById("loan-info").style.display = "block"

    document.getElementById("loan-id-modal").innerHTML = "<b>Loan ID: </b>" + book.loan.loanId
    document.getElementById("check-out-date-modal").innerHTML = "<b>Check Out Date: </b>" + book.loan.checkoutDate
    document.getElementById("due-date-modal").innerHTML = "<b>Due Date: </b>" + book.loan.dueDate
    document.getElementById("return-date-modal").innerHTML = "<b>Check In Date: </b>" + book.loan.returnDate
  }
  if (book.reservation != null) {
    document.getElementById("status-modal-dot").style.backgroundColor = "#DEC20B"
    document.getElementById("reservation-info").style.display = "block"
  
    document.getElementById("reservation-id-modal").innerHTML = "<b>Reservation ID: </b>" + book.reservation.reservationId
    document.getElementById("reservation-date-modal").innerHTML = "<b>Reservation Date: </b>" + book.reservation.reservationDate
  }
    if(book.loan != undefined){
      const member = await fetch(SERVER_URL + "/members/" + book.loan.memberId).then(res => res.json())
      document.getElementById("member-info").style.display = "block"
      document.getElementById("member-username-modal").innerHTML = ""
      document.getElementById("member-email-modal").innerHTML = ""
      document.getElementById("member-username-modal").innerHTML = "<b>Member User Name: </b>" + member.userName
      document.getElementById("member-email-modal").innerHTML = "<b>Member Email: </b>" + member.email
    }
    if(book.reservation != undefined){
      const member = await fetch(SERVER_URL + "/members/" + book.reservation.memberId).then(res => res.json())
      console.log("called")
      document.getElementById("member-info").style.display = "block"
      document.getElementById("member-username-modal").innerHTML = ""
      document.getElementById("member-email-modal").innerHTML = ""
      document.getElementById("member-username-modal").innerHTML = "<b>Member User Name: </b>" + member.userName
      document.getElementById("member-email-modal").innerHTML = "<b>Member Email: </b>" + member.email
    }
  

  if (target.classList.contains("delete-book-button")) {
    const delete_id = id.replace("-delete-book", "")
    deletebook(delete_id)
    location.reload()
  }
}

async function deletebook(id) {
  const options = {
    method: "DELETE",
    headers: { "Accept": "application/json" }
  };
  await fetch(URL +"/"+id, options).then(res => handleHttpErrors(res))
}

async function findBookById(){
  const id = document.getElementById("find-book-id").value
  if (id == "") {
    getAllbooks()
    document.getElementById("tbl-body").innerHTML = ""
    getAllbooks()
  }
  try {
    const book = await fetch(URL + "/" + id).then(res => res.json())
    document.getElementById("tbl-body").innerHTML = ""
    const tableRowsArray = `
    <tr>                                
      <td>${book.id} </td>              
      <td>${book.title} </td>                     
      <td>${book.author}</td>  
      <td>${book.publisher}</td>
      <td>${book.publishYear}</td>
      <td><button id="${book.id}-column-id" type="button"  class="btn btn-sm btn-dark" data-bs-toggle="modal" data-bs-target="#exampleModal">Details</button></td>      
    </tr>`
    document.getElementById("tbl-body").innerHTML = sanitizeStringWithTableRows(tableRowsArray)
    window.router.navigate("books?id=" + id)
  }
  catch (err) {
    console.error("UPPPPPS: " + err) //This can be done better
  }
}
async function renderBook(id){
  if (id == "") {
    getAllbooks()
    document.getElementById("tbl-body").innerHTML = ""
    getAllbooks()
  }
  try {
    const book = await fetch(URL + "/" + id).then(res => res.json())
    document.getElementById("tbl-body").innerHTML = ""
    const tableRowsArray = `
    <tr>                                
      <td>${book.id} </td>              
      <td>${book.title} </td>                     
      <td>${book.author}</td>  
      <td>${book.publisher}</td>
      <td>${book.publishYear}</td>
      <td><button id="${book.id}-column-id" type="button"  class="btn btn-sm btn-dark" data-bs-toggle="modal" data-bs-target="#exampleModal">Details</button></td>      
    </tr>`
    document.getElementById("tbl-body").innerHTML = sanitizeStringWithTableRows(tableRowsArray)
    window.router.navigate("books?id=" + id)
  }
  catch (err) {
    console.error("UPPPPPS: " + err) //This can be done better
  }
}