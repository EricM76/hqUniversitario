const contactForm = document.querySelector("#form");
const contactFormName = document.querySelector("#inputName");
const contactFormEmail = document.querySelector("#inputEmail");
const contactFormMessage = document.querySelector("#message");
const regExEmail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

let errors = {};

contactFormName.addEventListener("blur", (e) => {
    if(e.target.value === "") {
        contactFormName.classList.add("is-invalid");
        nameErrors.innerText = "Campo requerido";
        errors.name = true;
    }else{
        contactFormName.classList.remove("is-invalid");
        contactFormName.classList.add("is-valid");
        nameErrors.innerText = "";
        errors.name = false;
    }
})

contactFormEmail.addEventListener("blur", (e) => {
    if(e.target.value === "") {
        contactFormEmail.classList.add("is-invalid");
        emailErrors.innerText = "Campo requerido";
        errors.email = true;
    }else if(!regExEmail.test(e.target.value)){
        contactFormEmail.classList.add("is-invalid");
        emailErrors.innerText = "Email inválido";
        errors.email = true;
    }else{
        contactFormEmail.classList.remove("is-invalid");
        contactFormEmail.classList.add("is-valid");
        emailErrors.innerText = "";
        errors.email = false;
    }
})

contactFormMessage.addEventListener("blur", (e) => {
    if(e.target.value === "") {
        contactFormMessage.classList.add("is-invalid");
        messageErrors.innerText = "Campo requerido";
        errors.message = true;
    }else{
        contactFormMessage.classList.remove("is-invalid");
        contactFormMessage.classList.add("is-valid");
        messageErrors.innerText = "";
        errors.message = false;
    }
})

contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formElements = e.target.elements;
    console.log(formElements)
    for(let i = 0; i <= formElements.length - 1;i++){
        if(
            formElements[i].value === "" || 
            formElements[i].classList.contains("is-invalid")
        ) {
            formElements[i].classList.add("is-invalid");
            errors[formElements[i].name] = true;
        }
    }
    
    if(!(errors.name || errors.email || errors.message)){
        const data = {
            name: contactFormName.value,
            email: contactFormEmail.value,
            message: contactFormMessage.value,
        }
        let headers= new Headers();
        headers.append('Content-Type', 'application/json');

        const request = new Request('/contact', 
        {  method: 'POST',  body: JSON.stringify(data) , headers });
        fetch(request)
        .then(response => {
            if (!response.ok) throw Error(response.status);
            return response.json();
        })
        .then(json => alert(JSON.stringify(json)))
        .catch(error => console.error(error))
    }
})