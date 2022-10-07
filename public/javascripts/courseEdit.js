const changeLocked = async (id, {target}) => {
    console.log(id, target.value);
    document.getElementById('changeLocked-label' + id).innerHTML = target.checked ? `<i class='fas fa-lock'></i>` : `<i class='fas fa-unlock'></i>`;
    if(target.checked){
        document.getElementById('changeLocked-label' + id).classList.add(`btn-dark`); 
        document.getElementById('changeLocked-label' + id).classList.remove(`btn-warning`); 

    }else {
        document.getElementById('changeLocked-label' + id).classList.add(`btn-warning`); 
        document.getElementById('changeLocked-label' + id).classList.remove(`btn-dark`); 
    }
   
    try {
        let response = await fetch(`/videos/locked?id=${id}`,{
            method: 'PUT',
            body : JSON.stringify({locked : target.value}),
            headers : {
                'Content-type' : 'application/json'
            }
        });
        let result = await response.json()
        console.log(result)
    } catch (error) {
        console.log(error)
    }
}

const removeFeature = async (id) => {
    try {

        let response = await fetch('/courses/features/' + id, {
            method : 'DELETE'
        });
        let result = await response.json();

        console.log(result)
        
    } catch (error) {
        console.error
    }
};


const addFeature = (feature) => {
    $('features').innerHTML += `<option value="${feature}" selected>${feature}</option>`
    $('add-feature').value = null;
    $('add-feature').focus();
}

$('btn-add-feature').addEventListener('click', () => {
    $('add-feature').value && addFeature($('add-feature').value)
})

$('add-feature').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        if (this.value) {
            addFeature(this.value)
        }
    }
});

$('add-feature').addEventListener('focus', () => {
    $('form-addInfo-course') && $('form-addInfo-course').addEventListener('submit', (e) => e.preventDefault());
})

$('features').addEventListener('click', (e) => {
    if (e.target.childNodes.length > 0) {
        e.target.parentElement.removeChild(e.target);
        $('add-feature') &&  $('add-feature').focus()
    }
});

$('btn-submit').addEventListener('focus', () => {
    $('form-addInfo-course').submit()
});

$('video').addEventListener('change', ({ target }) => {
    let file = target.files[0];
    let blobURL = URL.createObjectURL(file);
    $("videoSource").src = blobURL;
});
$('image').addEventListener('change', ({ target }) => {
    let reader = new FileReader();
    reader.readAsDataURL(target.files[0])
    reader.onload = () => {
        $('imagePreview').src = reader.result
    }
});
