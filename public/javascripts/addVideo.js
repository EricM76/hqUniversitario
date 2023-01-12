    
let selectCategory = document.getElementById('categoryId');
let selectUnit = document.getElementById('unitId');
let selectYear = document.getElementById('year');
let selectTurn = document.getElementById('turnId');
let inputCourse = document.getElementById('inputCourse');
let inputResource = document.getElementById('resource');
let videoTag = document.getElementById('resourceTag');
let videoPreview = document.getElementById('resourcePreview');
let resourceLabel = document.getElementById('resourceLabel');
let inputLenth = document.getElementById('length');
let result;

const apiCall = async(url) => {
    try {
        let response = await fetch(url);
        let result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
};

window.onload = async () => {
    if(inputCourse.value == 13){
        
        selectYear.disabled = false;
        selectTurn.disabled = false;
        
        selectCategory.innerHTML = '<option value="3">Exámenes integradores</option>';
        
        selectYear.innerHTML = '<option value="" selected hidden>Año...</option>';
            for(let i=2005; i<= new Date().getFullYear(); i++ ) {
            selectYear.innerHTML += `<option value="${i}">${i}</option>`
            }

            selectTurn.innerHTML = '<option value="" selected hidden>Turno...</option>';
            result = await apiCall('/turns?course=' + 13);
            result.turns.forEach(turn => {
                selectTurn.innerHTML += `<option value="${turn.id}">${turn.month}</option>`;
            });
    }
}


document.getElementById('categoryId') && document.getElementById('categoryId').addEventListener('change', async (event) => {
    
    switch (event.target.value) {
        case "2":
        case "4":
            selectUnit.disabled = false;
            selectYear.disabled = true;
            selectTurn.disabled = true;
            selectYear.innerHTML = '<option value="" selected hidden>Año...</option>';
            selectTurn.innerHTML = '<option value="" selected hidden>Turno...</option>';
            
            selectUnit.innerHTML = '<option value="" selected hidden>Unidad...</option>';
            result = await apiCall('/units?course=' + inputCourse.value);
            result.units.forEach(unit => {
                selectUnit.innerHTML += `<option value="${unit.id}">${unit.number}</option>`;
            });

            break;
        case "3":
        case "6":
            selectUnit.disabled = true;
            selectYear.disabled = false;
            selectTurn.disabled = false;

            selectUnit.innerHTML = '<option value="" selected hidden>Unidad...</option>';
            
            selectYear.innerHTML = '<option value="" selected hidden>Año...</option>';
            for(let i=2005; i<= new Date().getFullYear(); i++ ) {
            selectYear.innerHTML += `<option value="${i}">${i}</option>`
            }

            selectTurn.innerHTML = '<option value="" selected hidden>Turno...</option>';
            result = await apiCall('/turns?course=' + inputCourse.value);
            result.turns.forEach(turn => {
                selectTurn.innerHTML += `<option value="${turn.id}">${turn.month}</option>`;
            });
          
            break;
        default:
            selectUnit.disabled = true;
            selectYear.disabled = true;
            selectTurn.disabled = true;
            selectUnit.innerHTML = '<option value="" selected hidden>Unidad...</option>';
            selectYear.innerHTML = '<option value="" selected hidden>Año...</option>';
            selectTurn.innerHTML = '<option value="" selected hidden>Turno...</option>';
            break;
    }
});

const changeOptions = async (e,id) => {
    switch (event.target.value) {
        case "2":
        case "4":
            document.getElementById('unitId' + id).disabled = false;
            document.getElementById('year' + id).disabled = true;
            document.getElementById('turnId' + id).disabled = true;
            document.getElementById('year' + id).innerHTML = '<option value="" selected hidden>Año...</option>';
            document.getElementById('turnId' + id).innerHTML = '<option value="" selected hidden>Turno...</option>';
            
            document.getElementById('unitId' + id).innerHTML = '<option value="" selected hidden>Unidad...</option>';
            result = await apiCall('/units?course=' + inputCourse.value);
            result.units.forEach(unit => {
                document.getElementById('unitId' + id).innerHTML += `<option value="${unit.id}">${unit.number}</option>`;
            });

            break;
        case "3":
        case "6":
            document.getElementById('unitId' + id).disabled = true;
            document.getElementById('year' + id).disabled = false;
            document.getElementById('turnId' + id).disabled = false;

            document.getElementById('unitId' + id).innerHTML = '<option value="" selected hidden>Unidad...</option>';
            
            document.getElementById('year' + id).innerHTML = '<option value="" selected hidden>Año...</option>';
            for(let i=2005; i<= new Date().getFullYear(); i++ ) {
            document.getElementById('year' + id).innerHTML += `<option value="${i}">${i}</option>`
            }

            document.getElementById('turnId' + id).innerHTML = '<option value="" selected hidden>Turno...</option>';
            result = await apiCall('/turns?course=' +  inputCourse.value);
            result.turns.forEach(turn => {
                document.getElementById('turnId' + id).innerHTML += `<option value="${turn.id}">${turn.month}</option>`;
            });
          
            break;
        default:
            document.getElementById('unitId' + id).disabled = true;
            document.getElementById('year' + id).disabled = true;
            document.getElementById('turnId' + id).disabled = true;
            document.getElementById('unitId' + id).innerHTML = '<option value="" selected hidden>Unidad...</option>';
            document.getElementById('year' + id).innerHTML = '<option value="" selected hidden>Año...</option>';
            document.getElementById('turnId' + id).innerHTML = '<option value="" selected hidden>Turno...</option>';
            break;
    }
}

inputResource && inputResource.addEventListener('change', (event) => {

    if (event.target.files && event.target.files[0]) {
        if(!regExExt.exec(event.target.value)){
            errorVideo.innerHTML = "Solo videos con extensión mp4";
            event.target.value = null;
        }else {
            let reader = new FileReader();

            reader.onload = function(e) {
            videoPreview.src = e.target.result
            videoTag.load()
    
            }.bind(this)
    
    
            reader.readAsDataURL(event.target.files[0]);
            resourceLabel.innerText = 'Cambiar video';
            errorVideo.innerHTML = null;

        }
       

       
    }
});

videoTag && videoTag.addEventListener('loadeddata', ({target}) => {
    inputLenth.value = Math.round(target.duration / 60)
});