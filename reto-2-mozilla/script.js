document.addEventListener("DOMContentLoaded", () => { console.log("Loaded!") })

//Input
const name = document.querySelector("#name")
const id = document.querySelector("#id")
const password = document.querySelector("#password")
const check = document.querySelector("#check")

//Input events
id.addEventListener("input", () => { id.value = id.value.trim() })

//Feedback
const errors = document.querySelector("#errors")

//Button
const send = document.querySelector("#send")
const clear = document.querySelector("#clear").addEventListener("click", () => { clearAll() })

//Button events
send.addEventListener("click", () => {
    let text = "Por favor:", flag = true

    if (/^$/.test(name.value.trim())) { text += "\n- Introduzca su nombre"; flag = false }

    if (!/^\d{11}$/.test(id.value)) { text += "\n- Introduzca un CI válido"; flag = false; id.value = "" }

    if (/^$/.test(password.value)) {
        text += "\n- Introduzca su contraseña"
        flag = false
        if (!/^$/.test(check.value))
            check.value = ""
    }
    else if (/^$/.test(check.value)) {
        text += "\n- Confirme su contraseña"
        flag = false
    }
    else if (password.value !== check.value) {
        text += "\n- Reescriba su contraseña"
        flag = false
        password.value = check.value = ""
    }

    if (flag) { errors.textContent = "Se han enviado los datos!"; clearAll() }
    else { errors.textContent = text }
});

//Function
function clearAll() { document.querySelectorAll("#inputs input").forEach(i => { i.value = "" }) }