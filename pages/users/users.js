import { SERVER_URL as URL} from "../../settings.js"
import { sanitizeStringWithTableRows, handleHttpErrors } from "../../utils.js"


export function initUsers() {
  document.getElementById("tbl-body").onclick = showUserDetails
  document.getElementById("exampleModal").onclick = showUserDetails
  getAllUsers()
}

export async function getAllUsers() {
  try {
    const usersFromServer = await fetch(URL).then(res => res.json())
    showAllData(usersFromServer)
  }
  catch (err) {
    console.error("UPPPPPS: " + err) //This can be done better
  }
}

function showAllData(data) {
  const tableRowsArray = data.map(user => `
  <tr>                                
    <td>${user.id} </td>              
    <td>${user.name} </td>                     
    <td>${user.address.street}</td>  
    <td>${user.address.city}</td>
    <td><button id="${user.id}-column-id" type="button"  class="btn btn-sm btn-dark" data-bs-toggle="modal" data-bs-target="#exampleModal">Details</button></td>      
  </tr>`)

  const tableRowsString = tableRowsArray.join("\n")
  document.getElementById("tbl-body").innerHTML = sanitizeStringWithTableRows(tableRowsString)
}

async function showUserDetails(evt) {
  const target = evt.target
  if (!target.classList.contains("btn")) return
  const id = target.id.replace("-column-id", "")
  document.getElementById("exampleModalLabel").innerText = "Details for userId: " + id
  const user = await fetch(URL + id).then(res => res.json())
  document.getElementById("all-user-footer").innerHTML = `
    <button type="button" class="other-page btn btn-dark other-page" data-bs-dismiss="modal" id="${id}-edit-user">Rediger</button>
    <button type="button" class="delete-user-button btn btn-dark" data-bs-dismiss="modal" id="${id}-delete-user">Delete User</button>
    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
    `
  if (target.classList.contains("other-page")) {
    const id = target.id.replace("-edit-user", "")
    window.router.navigate("edit-user?id=" + id)
  }
  document.getElementById("user-content").innerText = JSON.stringify(user, null, 2)


  if (target.classList.contains("delete-user-button")) {
    const delete_id = id.replace("-delete-user", "")
    deleteUser(delete_id)
  }
}

async function deleteUser(id){
  const options = {
    method: "DELETE",
    headers: { "Accept": "application/json" }
  };
  await fetch(URL + id, options).then(res => handleHttpErrors(res))
}