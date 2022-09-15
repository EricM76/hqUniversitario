const validateReferredUser = async (email) => {
    const request = new Request(`/api/referred/${email}`);
    return await fetch(request)
    .then(response => {
        if (!response.ok) throw Error(response.status);
        return response.json();
    })
    .then(res => res)
    .catch(error => console.error(error))
}

const RegExEmail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
const inputNameReferred = document.querySelector("#nameReferred");
const inputEmailReferred = document.querySelector("#emailReferred");
const referredForm = document.querySelector("#referredForm")

let referredError = false;

inputNameReferred.addEventListener("blur", async (e) => {
    switch (true) {
        case e.target.value === "":
            inputNameReferred.classList.add("is-invalid");
            nameReferredError.innerText = "Ingresa un email";
            referredError = true;
            break;
        default:
            inputNameReferred.classList.remove("is-invalid");
            inputNameReferred.classList.add("is-valid");
            nameReferredError.innerText = "";
            referredError = false;
            break;
    }
})

inputEmailReferred.addEventListener("blur", async (e) => {
    let userIsValid = await validateReferredUser(e.target.value);
    switch (true) {
        case e.target.value === "":
            inputEmailReferred.classList.add("is-invalid");
            emailReferredError.innerText = "Ingresa un email";
            referredError = true;
            break;
        case !RegExEmail.test(e.target.value):
            inputEmailReferred.classList.add("is-invalid");
            emailReferredError.innerText = "Email inválido";
            referredError = true;
            break;
        case userIsValid.state:
            inputEmailReferred.classList.add("is-invalid");
            emailReferredError.innerText = userIsValid.message;
            referredError = true;
            break;  
        default:
            inputEmailReferred.classList.remove("is-invalid");
            inputEmailReferred.classList.add("is-valid");
            emailReferredError.innerText = "";
            referredError = false;
            break;
    }
})

referredForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if(inputNameReferred.value == "" || inputEmailReferred.value == "") {
        referredError = true;
        submitReferredError.innerText = "Completa todos los campos"
    }else{
        submitReferredError.innerText = "";
    }
    
    if(!referredError){
        referredForm.submit()
    }
})
