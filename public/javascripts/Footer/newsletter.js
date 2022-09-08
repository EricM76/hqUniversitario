const newsLetterRegExEmail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
const newsletterForm = document.querySelector("#newsletterForm")
const inputNewsletter = document.querySelector("#inputNewsletter");
let newsLetterErrors = false;
inputNewsletter.addEventListener("blur", (e) => {
    if(e.target.value === "") {
        inputNewsletter.classList.add("is-invalid");
        newsLetterErrors = true;
    }else if(!newsLetterRegExEmail.test(e.target.value)){
        inputNewsletter.classList.add("is-invalid");
        newsLetterErrors = true;
    }else{
        inputNewsletter.classList.remove("is-invalid");
        inputNewsletter.classList.add("is-valid");
        newsLetterErrors = false;
    }
})

newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if(inputNewsletter.value == "") {
        newsLetterErrors = true;
        inputNewsletter.classList.add("is-invalid");
    }
    
    if(!newsLetterErrors){
        const data = {
            email: inputNewsletter.value,
        }
        let headers= new Headers();
        headers.append('Content-Type', 'application/json');

        const request = new Request('/contact', 
        {  method: 'POST',  body: JSON.stringify(data) , headers });
        alert(JSON.stringify(data))
        /* fetch(request)
        .then(response => {
            if (!response.ok) throw Error(response.status);
            return response.json();
        })
        .then(json => alert(JSON.stringify(json)))
        .catch(error => console.error(error)) */
    }
})
