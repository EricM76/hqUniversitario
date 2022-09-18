const provinceSelect = document.querySelector("#provinceSelect");
const citiesSelect = document.querySelector("#citiesSelect");

provinceSelect.addEventListener("change", async (e) => {
    const selectedProvince = e.target.value;
    const request = new Request(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${selectedProvince}&max=5000`);
     fetch(request)
     .then(response => {
        if (!response.ok) throw Error(response.status);
        return response.json();
     })
     .then(cities => {
        citiesSelect.innerHTML = ""
        cities.localidades.forEach(city => {
            citiesSelect.innerHTML += `<option value="${city.nombre}">${city.nombre} </option>`
        })
     })
     .catch(error => console.error(error))
})
/* 
 const data = {
            name: contactFormName.value,
            email: contactFormEmail.value,
            message: contactFormMessage.value,
        }
        let headers= new Headers();
        headers.append('Content-Type', 'application/json');

        const request = new Request('/contact', 
        {  method: 'POST',  body: JSON.stringify(data) , headers });
        fetch(request)
        .then(response => {
            if (!response.ok) throw Error(response.status);
            return response.json();
        })
        .then(json => alert(JSON.stringify(json)))
        .catch(error => console.error(error))
*/