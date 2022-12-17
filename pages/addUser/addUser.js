import { SERVER_URL as URL } from "../../settings.js"

export async function initAddUser() {

    document.getElementById("create-form").onsubmit = addUser


}


async function addUser() {
    const name = document.getElementById("name-create-input").value;
    const email = document.getElementById("email-create-input").value;
    const phone = document.getElementById("phone-create-input").value;
    const street = document.getElementById("street-create-input").value;
    const city = document.getElementById("city-create-input").value;

    const user = {
        name: name,
        email: email,
        phone: phone,
        street: street,
        city: city
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    }
    try {
        const response = await fetch(URL, options).then(res => res.json())
        if (response.status === 200) {
            window.router.navigate("users")
        }
    } catch (err) {
        console.log("UPS " + err.message)
    }
}



