const $ = (element) => document.getElementById(element);

const addInput = (event) => {
    const {target} = event;
    let i = +target.getAttribute('data-box');
    let file = target.files[0].name;
    let filename = file.slice(0,file.lastIndexOf('.'))
    $('title' + i).disabled = false;
    $('title' + i).value = filename;
    $('box-note' + i).classList.remove('d-none');
    $('label' + i).classList.remove('d-none');
    target.classList.add('d-none');

    const box = document.createElement('div');
        box.setAttribute('class', 'd-flex align-items-center gap-2');
        box.setAttribute('id', 'box' + (i+1));
        
        const boxInput = document.createElement('div');
        boxInput.setAttribute('class', 'mb-3');
        box.appendChild(boxInput);

    const label = document.createElement('label');
        label.setAttribute('class', 'fs-2 text-danger d-none');
        label.setAttribute('id', 'label' + (i+1));
        label.innerHTML = '<i class="fa fa-file-pdf-o"></i>'
        boxInput.appendChild(label)
    
    const inputFile = document.createElement('input');
        inputFile.setAttribute('class', 'form-control');
        inputFile.setAttribute('type', 'file');
        inputFile.setAttribute('id', 'note');
        inputFile.setAttribute('name', 'note' );
        inputFile.setAttribute('accept', '.pdf');
        inputFile.setAttribute('data-box',i+1);
        inputFile.setAttribute('onchange', "addInput(event)");
        boxInput.appendChild(inputFile);

    const box2 = document.createElement('div');
        box2.setAttribute('class', 'd-flex gap-2 align-items-center w-100 d-none');
        box2.setAttribute('id', 'box-note' + (i + 1));
        box.appendChild(box2);

    const box3 = document.createElement('div');
        box3.setAttribute('class', 'input-group mb-3');
        box2.appendChild(box3);

    const span = document.createElement('span');
        span.setAttribute('class','input-group-text');
        span.textContent = 'Título';
        box3.appendChild(span);

    const inputTxt = document.createElement('input');
        inputTxt.setAttribute('class', 'form-control');
        inputTxt.setAttribute('type', 'text');
        inputTxt.setAttribute('name', 'titles');
        inputTxt.setAttribute('disabled', true);
        inputTxt.setAttribute('id', 'title' + (i+1));
        box3.appendChild(inputTxt);


    const pButton = document.createElement('p');
        pButton.setAttribute('class', 'fs-2 text-danger');
        pButton.setAttribute('onclick',`removeInput('box${i+1}')`);
        pButton.innerHTML = '<i class="fa fa-times"></i>';
    
        box2.appendChild(pButton);

    document.getElementById('box-notes').appendChild(box)
}

const removeInput= (box) => {
    
    var element = document.getElementById(box);
    element.parentNode.removeChild(element);
    
}

const removeNote = async (id,file) => {
    try {
        let response = await fetch('/notes/remove/' + id, {
            method : 'DELETE',
            body : JSON.stringify({
                file : file
            }),
            headers: {
                "Content-type": "application/json",
              },
        })
        let result = await response.json();
        if(result.ok){
            console.log(result)
            $('storeNote' + id).remove();
            if(+result.count === 0){
                $('box-store-notes').innerHTML = '<p class="alert alert-warning">El curso aún no tiene apuntes agregados</p>'
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const removeUnit = async (id,courseId) => {
    try {
        let response = await fetch('/units/remove/' + id,{
        method : 'DELETE',
    });
    let result = await response.json()

    console.log(result.msg);
    window.location.href = `/courses/edit/${courseId}?next=units`;

    } catch (error) {
        console.error(result.msg)
    }
}

const removeTurn = async (id,courseId) => {
    try {
        let response = await fetch(`/turns/remove?courseId=${courseId}&turnId=${id}`,{
        method : 'DELETE',
    });
    let result = await response.json()

    if(result.ok){
        let response = await fetch(`/turns?course=${courseId}`)
        let result = await response.json();

        if(result.ok){
            $('box-turns').innerHTML = null;

            result.turns.forEach((turn,index) => {

                $('box-turns').innerHTML += `  
                <button type="button" class="btn btn-primary position-relative fs-4">
                ${turn.month}
                    <span class="position-absolute top-0 start-100 translate-middle p-1 px-2 bg-danger border border-light rounded-circle fs-6" onclick="removeTurn('${turn.id}','${courseId}')">
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </span>
                </button>`
            });
        }

    }

    } catch (error) {
        console.error
    }
}

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

        console.log(result);

        for (var i = 0; i <  $('features').options.length; i++) {
            $('features').options[i].selected = true;
        }
        
    } catch (error) {
        console.error
    }
};

const removeCareer = async (careerId, courseId) => {
    try {

        let response = await fetch(`/courses/careers/${careerId}/${courseId}`, {
            method : 'DELETE'
        });
        let result = await response.json();

        console.log(result);

        for (var i = 0; i <  $('careers').options.length; i++) {
            $('careers').options[i].selected = true;
        };
        
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
    if (e.target.id !== "features" && e.target.childNodes.length > 0) {
        e.target.parentElement.removeChild(e.target);
        $('add-feature') &&  $('add-feature').focus()
    }
});

$('careers').addEventListener('click', (e) => {
    if (e.target.id !== "careers" && e.target.childNodes.length > 0) {
        e.target.parentElement.removeChild(e.target);
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


$('formFile') && $('formFile').addEventListener('change', ({ target }) => {
    let reader = new FileReader();
    reader.readAsDataURL(target.files[0])
    reader.onload = () => {
        $('imgPrev').src = reader.result
    };
    $('btn-formFile').innerHTML = "Cambiar imagen"
});

$('universityId') && $('universityId').addEventListener('change', async ({ target }) => {
    try {
        let response = await fetch('/faculties/get-by-university?universityId=' + target.value);
        let result = await response.json()
        /* console.log(result) */
        if (result.ok) {
            $('careers').innerHTML = null;
            $('facultyId').innerHTML = '<option value="" select hidden>Seleccione...</option>'
            result.data.forEach(faculty => {
            $('facultyId').innerHTML += `<option value="${faculty.id}">${faculty.name}</option>`
            })
        } else {
            throw new Error('upss, algo anduvo mal')
        }
    } catch (error) {
        console.error
    }
});

$('facultyId') && $('facultyId').addEventListener('change', async ({ target }) => {
    try {
        let response = await fetch('/careers/get-by-faculty?facultyId=' + target.value);
        let result = await response.json()
        
        if (result.ok) {
            $('careers').innerHTML = null;
            result.data.forEach(career => {
            $('careers').innerHTML += `<option value="${career.id}">${career.name}</option>`
        })

        if($('check-all')){
            $('check-all').disabled = false
        } 

        } else {
            throw new Error('upss, algo anduvo mal')
        }
    } catch (error) {
        console.error
    }
});

$('check-all') && $('check-all').addEventListener('click', ({target}) => {
    if(target.checked){
        for (var i = 0; i <  $('careers').options.length; i++) {
            $('careers').options[i].selected = true;
        }
      
    }else {
        for (var i = 0; i <  $('careers').options.length; i++) {
            $('careers').options[i].selected = false;
        }
    }
});


/* $('careers') && $('careers').addEventListener('change', ({ target }) => {
    let index = target.selectedIndex;

    careersSelected[index] = !careersSelected[index];

    for (var i = 0; i < target.options.length; i++) {
        target.options[i].selected = careersSelected[i];
    }
   
}); */

const confirmDeleteVideo = (e) => {
    e.preventDefault();
    Swal.fire({
        title: '¿Está seguro que desea eliminar el video?',
        text: '¡No se podrán revertir los cambios!',
        showDenyButton: true,
        confirmButtonText: 'Eliminar',
        denyButtonText: `Cancelar`,
        confirmButtonColor: '#FF0000',
        denyButtonColor: '#696969',
    }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
           e.target.submit()
        }
    })
}
