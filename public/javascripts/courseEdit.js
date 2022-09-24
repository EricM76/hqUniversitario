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
    } catch (error) {
        console.log(error)
    }
}
