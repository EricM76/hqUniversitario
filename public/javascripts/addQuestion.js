    
    const enableCheck = (button,score,file,image,e) => {
        if(e.target.value.trim()){
            document.getElementById(button).disabled = false;
            document.getElementById(file).disabled = false;
            /* document.getElementById(score).disabled = false;
            document.getElementById(score).value = 5; */

        }else{
            document.getElementById(button).checked = false;
            document.getElementById(button).disabled = true;
            document.getElementById(file).disabled = true;
            /* document.getElementById(score).value = null;
            document.getElementById(score).disabled = true; */


        }
    };

    const checkValue = () => {
        event.target.value = event.target.value < 1 ? 1 : event.target.value > 99 ? 99 : event.target.value;
    }

    document.getElementById('form-add-question').addEventListener('submit',(e) => {
        e.preventDefault();
        let error = false;
        const elements = e.target.elements;
        console.log(elements)
        const inputQuestion = elements[0];
        const inputScore = elements[1];
        const inputAnswer1 = elements[4];
        const inputAnswer2 = elements[7];
        const checkCorrects = [elements[3].checked,elements[6].checked,elements[9].checked,elements[12].checked,elements[15].checked,elements[18].checked]
         !inputQuestion.value.trim() && inputQuestion.classList.add('is-invalid');
         !inputScore.value.trim() && inputScore.classList.add('is-invalid');
         !inputAnswer1.value.trim() && inputAnswer1.classList.add('is-invalid');
         !inputAnswer2.value.trim() && inputAnswer2.classList.add('is-invalid');
         document.getElementById('msg-error').innerText =  !checkCorrects.includes(true) && inputAnswer1.value.trim() && inputAnswer2.value.trim() ? "Debe indicar la respuesta correcta" : null;
        for (let i = 0; i < elements.length; i++) {
            if(elements[i].classList.contains('is-invalid')){
                error = true
            }
        }
        error = !checkCorrects.includes(true)
        !error && e.target.submit()
    })
