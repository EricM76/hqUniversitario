const showPreview = (id) => {
    let reader = new FileReader();
    reader.readAsDataURL($('image' + id).files[0])
    reader.onload = () => {
        $('imgPreview' +id).src = reader.result
    };
    $('btn-image' + id).innerHTML = "Cambiar imagen"
    }