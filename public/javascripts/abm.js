const $ = (element) => document.getElementById(element);

$('formFile') && $('formFile').addEventListener('change', ({ target }) => {
    let reader = new FileReader();
    reader.readAsDataURL(target.files[0])
    reader.onload = () => {
        $('imgPrev').src = reader.result
    };
    $('btn-formFile').innerHTML = "Cambiar imagen"
})