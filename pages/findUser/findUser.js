import { SERVER_URL as URL } from "../../settings.js"
//Add id to this URL to get a single user

export async function initFindUser(match) {

  document.getElementById("btn-fetch-user").onclick = fetchUserData
  if (match?.params?.id) {
    const id = match.params.id
    try {
      renderUser(id)
    } catch (err) {
      document.getElementById("error").innerText = "Could not find user: " + id
    }
  }
  document.getElementById("user-id-input").value = ""
}

async function fetchUserData() {
  document.getElementById("error").innerText = ""
  const id = document.getElementById("user-id-input").value
  if (!id) {
    document.getElementById("error").innerText = "Please provide an id"
    return
  }
  try {
    renderUser(id)
  } catch (err) {
    console.log("UPS " + err.message)
  }
}

async function renderUser(id) {
  try {
    const user = await fetch(URL + id).then(res => res.json())
    //jsonplaceholder returns an empty object for users not found, NOT an error
    if (Object.keys(user).length === 0) {  //checks for an empty object = {}
      throw new Error("No user found for id:" + id)
    }

    document.getElementById("id").innerText = user.id;
    document.getElementById("name").innerText = user.name;
    document.getElementById("email").innerText = user.email;
    document.getElementById("phone").innerText = user.phone;
    document.getElementById("street").innerText = user.address.street;
    document.getElementById("city").innerText = user.address.city;

  } catch (err) {
    document.getElementById("error").innerText = err
  }
}