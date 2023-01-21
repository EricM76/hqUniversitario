document.getElementById('universityId').addEventListener('change',async ({target}) => {
    try {
        let response = await fetch('/faculties/get-by-university?universityId=' + target.value);
        let result = await response.json()
        console.log(result)
        if(result.ok){
            document.getElementById('facultyId').innerHTML = '<option value="" select hidden>Seleccione...</option>'
            result.data.forEach(faculty => {
                document.getElementById('facultyId').innerHTML +=`<option value="${faculty.id}">${faculty.name}</option>`
            })
        }else{
            throw new Error('upss, algo anduvo mal')
        }
    } catch (error) {
        console.error
    }
})