const addInput = (event) => {
    const {target} = event;
    let i = +target.getAttribute('data-box');
    let file = target.files[0].name;
    let filename = file.slice(0,file.lastIndexOf('.'))
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