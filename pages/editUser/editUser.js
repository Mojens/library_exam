import { SERVER_URL as URL } from "../../settings.js"
//Add id to this URL to get a single user

export async function initEditUser(match) {

    document.getElementById("edit-form").onsubmit = editUser;
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
        window.router.navigate("edit-user?id=" + id)
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
        document.getElementById("id").innerText = "User to edit with id: " + user.id;
        document.getElementById("user-id-input").value = user.id;
        document.getElementById("name-edit-input").value = user.name;
        document.getElementById("email-edit-input").value = user.email;
        document.getElementById("phone-edit-input").value = user.phone;
        document.getElementById("street-edit-input").value = user.address.street;
        document.getElementById("city-edit-input").value = user.address.city;

    } catch (err) {
        document.getElementById("error").innerText = err
    }
}

async function editUser() {
    document.getElementById("error").innerText = ""
    const id = document.getElementById("id").value;
    const name = document.getElementById("name-edit-input").value;
    const email = document.getElementById("email-edit-input").value;
    const phone = document.getElementById("phone-edit-input").value;
    const street = document.getElementById("street-edit-input").value;
    const city = document.getElementById("city-edit-input").value;

    const user = {
        id: id,
        name: name,
        email: email,
        phone: phone,
        street: street,
        city: city
    }
    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    }
    try {
        const response = await fetch(URL + id, options).then(res => res.json())
        if (response.status === 200) {
            document.getElementById("error").innerText = "User updated successfully"
            window.router.navigate("users")
            
        }
    } catch (err) {
        document.getElementById("error").innerText = err
    }
}