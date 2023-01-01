document.getElementById('btn-modal-addUnit').addEventListener('click', () => {
    document.getElementById('checkError').innerHTML =  null;
    let elements = document.getElementById('form-modal-add-unit').elements

    for (let i = 0; i < elements.length; i++) {
        elements[i].value = null
        elements[i].classList.remove('is-invalid')
    }

})

let check = async ({target}, courseId) => {

    if(target.getAttribute('data-unit') != target.value){
        try {
        let response = await fetch(`/units/check?number=${target.value}&courseId=${courseId}`);
        let result = await response.json();

        if(result.ok && result.find){
            document.getElementById('checkError').innerHTML =  'Ya existe una unidad con este número';
            target.classList.add('is-invalid')
        }else{
            document.getElementById('checkError').innerHTML =  null;
            target.classList.remove('is-invalid')
        }

    } catch (error) {
        console.error(result.msg)
    }
    }else{
        target.classList.remove('is-invalid')

    }
}   



const sendModalForm = async (e,id) => {
e.preventDefault();
const elements = e.target.elements;
let error = false;

for (let i = 0; i < elements.length - 2; i++) {
    if(!elements[i].value){
        elements[i].classList.add('is-invalid');
        error = true
    }
}

for (let i = 0; i < elements.length - 2; i++) {
    if(elements[i].classList.contains('is-invalid')){
        error = true
    }
}

if(!error){
let data = {
    number : elements.number.value,
    name : elements.name.value,
    courseId : id
}
try {
    let response = await fetch('/units/add',{
        method : 'POST',
        body : JSON.stringify(data),
        headers : {
            'Content-Type' : 'application/json'
        }
    });
    let result = await response.json()

    console.log(result.msg);
    window.location.href = `/courses/edit/${id}?next=units`

} catch (error) {
    console.error(result.msg)
}
}

}
