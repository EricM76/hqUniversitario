document.getElementById('newTurn').addEventListener('keyup', async ({target}) => {
    try {
        let response = await fetch('/turns/all');
        let result = await response.json();
        let error = false
        if(result.ok){
            result.turns.forEach(turn => {
                if(turn.month.toLowerCase() === target.value.toLowerCase().trim()){
                    error = true
                }
            });
            if(error){
                target.classList.add('is-invalid');
                document.getElementById('btn-submit-add-turn').classList.add('disabled');
                document.getElementById('msg-error-new-turn').innerHTML = "El turno ya existe o está aplicado.";
            }else{
                target.classList.remove('is-invalid')
                document.getElementById('btn-submit-add-turn').classList.remove('disabled');
                document.getElementById('msg-error-new-turn').innerHTML = null;

            }
        }
      
    } catch (error) {
        console.error
    }
})


const sendModalFormAddTurn = async (e, id) => {
    e.preventDefault();
    const elements = $('form-modal-add-turn').elements;
    const turns = [];
    elements.turns.forEach(turn => {
        if (turn.checked) {
            turns.push(+turn.value);
        }
    });
    let error = false;

    if (!error) {
        /* let data = {
            turns : elements.month.value,
            courseId : id
        } */
        try {
            let response = await fetch(`/turns/add?course=${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    turns,
                    newTurn: elements.newTurn.value
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let result = await response.json()
            console.log(result);

            if (result.ok) {
                let response = await fetch(`/turns?course=${id}`)
                let result = await response.json();
              
                if(result.ok){
                    $('box-turns').innerHTML = null;
                    result.turns.forEach(turn => {
                        $('box-turns').innerHTML += `  
                        <button type="button" class="btn btn-primary position-relative fs-4">
                        ${turn.month}
                            <span class="position-absolute top-0 start-100 translate-middle p-1 px-2 bg-danger border border-light rounded-circle fs-6" onclick="removeTurn('${turn.id}','${id}')">
                                <i class="fa fa-times" aria-hidden="true"></i>
                            </span>
                        </button>`
                    });
                    $('btn-close-add-turn').click();

                }

            }
            /* window.location.href = `/courses/edit/${id}?next=turns` */

        } catch (error) {
            console.error
        }
    }

}
