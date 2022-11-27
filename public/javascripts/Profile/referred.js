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
const referredForm = document.querySelector("#referredForm");
const referredSubmitButton = document.querySelector("#referredButton");
referredSubmitButton.disabled = true;

let referredError = false;

inputNameReferred.addEventListener("blur", async (e) => {
    switch (true) {
        case e.target.value === "":
            inputNameReferred.classList.add("is-invalid");
            nameReferredError.innerText = "Ingresa un nombre";
            referredError = true;
            break;
        default:
            inputNameReferred.classList.remove("is-invalid");
            inputNameReferred.classList.add("is-valid");
            nameReferredError.innerText = "";
            referredError = false;
            referredSubmitButton
            break;
    }
});

inputNameReferred.addEventListener("focus", async (e) => {
   
    inputNameReferred.classList.remove("is-valid");
    inputNameReferred.classList.remove("is-invalid");

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
            referredSubmitButton.disabled = false;
            break;
    }
})

inputEmailReferred.addEventListener("focus", async (e) => {
   
    inputEmailReferred.classList.remove("is-valid");
    inputEmailReferred.classList.remove("is-invalid");

})

inputEmailReferred.addEventListener("keyup", async (e) => {
    let userIsValid = inputEmailReferred.value.length && await validateReferredUser(e.target.value);

    if(userIsValid.state){
        inputEmailReferred.classList.add("is-invalid");
        emailReferredError.innerText = userIsValid.message;
        referredError = true;
        referredSubmitButton.disabled = true;

    }else if(!userIsValid.state && inputNameReferred.value){
        inputEmailReferred.classList.remove("is-invalid");
        emailReferredError.innerText = null;
        referredError = false;
        referredSubmitButton.disabled = false;

    }
});


referredForm.addEventListener("submit", (e) => {
    e.preventDefault();
  /*   if(inputNameReferred.value == "" || inputEmailReferred.value == "") {
        referredError = true;
        submitReferredError.innerText = "Completa todos los campos"
    }else{
        submitReferredError.innerText = "";
    } */
    
    if(!referredError){

        Swal.fire({
            icon: 'info',
            title: '¡Gracias por referir a\nHQ Universitario!',
            text: 'Tu referido recibirá un email, con la invitación a registrarse en HQ Universitario. Cuando su registro sea exisotoso te lo comunicaremos.',
        }).then((result) => {
            if (result.isConfirmed) {
                referredSubmitButton.disabled = false;
                referredForm.submit()
            } 
          })

       
    }
})
