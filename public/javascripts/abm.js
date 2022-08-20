const $ = (element) => document.getElementById(element);
var careersSelected = [];

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
            $('careerId').innerHTML = null;
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
            $('careerId').innerHTML = null;
            careersSelected = [];
            result.data.forEach(career => {
            $('careerId').innerHTML += `<option value="${career.id}">${career.name}</option>`
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
        for (var i = 0; i <  $('careerId').options.length; i++) {
            $('careerId').options[i].selected = true;
        }
        for (var i = 0; i <  $('careerId').options.length; i++) {
            careersSelected[i] =  $('careerId').options[i].selected;
        }
    }else {
        for (var i = 0; i <  $('careerId').options.length; i++) {
            $('careerId').options[i].selected = false;
        }
        for (var i = 0; i <  $('careerId').options.length; i++) {
            careersSelected[i] =  $('careerId').options[i].selected;
        }
    }
})


$('careerId') && $('careerId').addEventListener('change', ({ target }) => {
    let index = target.selectedIndex;

    careersSelected[index] = !careersSelected[index];

    for (var i = 0; i < target.options.length; i++) {
        target.options[i].selected = careersSelected[i];
    }
   
    for (var i = 0; i < target.options.length; i++) {
        careersSelected[i] = target.options[i].selected;
    }

})