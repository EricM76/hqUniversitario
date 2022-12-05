const sendModalFormAddTurn = async (e,id) => {
e.preventDefault();
const elements = e.target.elements;
let error = true;
console.log(elements)

if(!error){
let data = {
    turns : elements.month.value,
    courseId : id
}
try {
    let response = await fetch('/turns/add',{
        method : 'POST',
        body : JSON.stringify(data),
        headers : {
            'Content-Type' : 'application/json'
        }
    });
    let result = await response.json()

    console.log(result.msg);
    window.location.href = `/courses/edit/${id}?next=turns`

} catch (error) {
    console.error(result.msg)
}
}

}
