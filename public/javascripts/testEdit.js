window.addEventListener('load', () => {
    let query = new URLSearchParams(window.location.search)
    if (query.has('new')) {
        $('btn-addQuestion').click()
    };
});

const deleteQuestion = async (id) => {

    Swal.fire({
        title: '¿Está seguro que desea eliminar la pregunta?',
        text: '¡No se podrán revertir los cambios!',
        showDenyButton: true,
        confirmButtonText: 'Eliminar',
        denyButtonText: `Cancelar`,
        confirmButtonColor: '#FF0000',
        denyButtonColor: '#696969',
    }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            try {
                let response = await fetch(`/tests/questions/${id}`, {
                    method: 'DELETE'
                });
                let result = await response.json()
                console.log(result);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Elimminada con éxito',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(() => {
                    window.location.reload()
                }, 1500);
        
            } catch (error) {
                console.log(error)
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Ups, hubo un error',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    })
   
};

const deleteAnswer = async (id) => {

    try {
        let response = await fetch(`/tests/questions/count-answers/${id}`);
        let result = await response.json();
        console.log(result)
        if(result.data > 2){
            Swal.fire({
                title: '¿Está seguro que desea eliminar la respuesta?',
                text: '¡No se podrán revertir los cambios!',
                showDenyButton: true,
                confirmButtonText: 'Eliminar',
                denyButtonText: `Cancelar`,
                confirmButtonColor: '#FF0000',
                denyButtonColor: '#696969',
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
        
                    try {
                        let response = await fetch(`/tests/answers/${id}`, {
                            method: 'DELETE'
                        });
                        let result = await response.json();
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Elimminada con éxito',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setTimeout(() => {
                            window.location.reload()
                        }, 1500);
                
                    } catch (error) {
                        console.error(error)
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Ups, hubo un error',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                }
            })        
        }else {
            Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'No puede haber menos de dos respuestas',
                        showConfirmButton: true,
                        confirmButtonText: 'Entendido',
                        confirmButtonColor : "royalblue"
                    })
        }
     
    } catch (error) {
        console.error(error)
    }


}

const imagePrev = function (id) {
    let reader = new FileReader();
    reader.readAsDataURL(this.event.target.files[0])
    reader.onload = () => {
        $('btnAdd' + id).innerText = 'Cambiar imagen';
        $('btnSave' + id).hidden = false;
        $('imagePrev' + id).src = reader.result;
        $('btnSave' + id).focus();
    }

};

const clearImage = (id, image) => {
    setTimeout(() => {
        $('btnSave' + id).hidden = true;
        $('imagePrev' + id).src = !image ? "/images/questions/noImage.jpeg" : $('imagePrev' + id).src;
        $('answer' + id).value = null;
    }, 1000);
};

const saveImage = async (id) => {
    let data = new FormData();
    data.append('image', $('answer' + id).files[0]);

    console.log(data)

    try {
        let response = await fetch(`/tests/answers/change-image/${id}`, {
            method: 'PUT',
            body: data,
            'Content-Type': 'multipart/form-data'
        })

        let result = await response.json();

        console.log(result);
        if (result.ok) {
            window.location.reload()
        }

    } catch (error) {
        console.error(error)
    }
}

$('addQuestion').addEventListener('hidden.bs.modal', () => {
    $('question').value = null;
    const inputAnswers = document.querySelectorAll('.new-question');
    for (let i = 0; i < inputAnswers.length; i++) {
        inputAnswers[i].value = null
    }
    const inputChecks = document.querySelectorAll('.form-check-input');
    for (let i = 0; i < inputChecks.length; i++) {
        inputChecks[i].checked = false;
        inputChecks[i].disabled = true;
    }
    const inputFiles = document.querySelectorAll('.input-file');
    for (let i = 0; i < inputFiles.length; i++) {
        inputFiles[i].value = null;
        inputFiles[i].disabled = false;

    }
    const inputScores = document.querySelectorAll('.score');
    for (let i = 0; i < inputScores.length; i++) {
        inputScores[i].value = null;
        inputScores[i].disabled = true;

    }
});

/* limpia los campos del formulario addAnswer */
const clearInputsNewAnswer = (score, file, text) => {
    document.getElementById(score).value = null;
    document.getElementById(file).value = null;
    document.getElementById(text).value = null;
    document.getElementById(text).classList.remove('is-invalid');

    document.getElementById(score).disabled = true;
    document.getElementById(file).disabled = true;

};

const enableCheckNewAnswer = (score, file, image, e) => {
    if (e.target.value.trim()) {
        document.getElementById(file).disabled = false;
        document.getElementById(score).disabled = false;
        document.getElementById(score).value = 5;

    } else {
        document.getElementById(file).disabled = true;
        document.getElementById(score).disabled = true;
    }
};


const sendFormAddAnswer = async (idQuestion) => {
    let data = new FormData();
    data.append('content', $('textQuestion' + idQuestion).value)
    data.append('score', $('scoreQuestion' + idQuestion).value)
    data.append('image', $('fileQuestion' + idQuestion).files[0]);
    console.log(data.get('score'))
    try {
        if (data.get('content').length) {
            let response = await fetch('/tests/answers/' + idQuestion, {
                method: 'POST',
                body: data,
                'Content-Type': 'multipart/form-data'
            });
            let result = await response.json()
            console.log(result);
            $('form-edit-test').submit()
            window.location.reload()
        } else {
            $('textQuestion' + idQuestion).classList.add('is-invalid')
        }

    } catch (error) {
        console.error(error)
    }
}

const deleteTest = async (idTest, idCourse) => {

    Swal.fire({
        title: '¿Está seguro que desea eliminar el exámen?',
        text: '¡No se podrán revertir los cambios!',
        showDenyButton: true,
        confirmButtonText: 'Eliminar',
        denyButtonText: `Cancelar`,
        confirmButtonColor: '#FF0000',
        denyButtonColor: '#696969',
    }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            try {
                let response = await fetch('/tests/remove/' + idTest, {
                    method: 'DELETE'
                })
                let result = await response.json();
                console.log(result);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Elimminado con éxito',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(() => {
                    window.location.href = `/courses/edit/${idCourse}?next=tests`
                }, 1500);

            } catch (error) {
                console.error(error)
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Ups, hubo un error',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    })


}