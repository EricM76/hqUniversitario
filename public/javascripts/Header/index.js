window.addEventListener("load", async () => {
    const universitiesMenu = document.querySelector("#universitiesMenu");
    const request = new Request('/api/university');
    await fetch(request)
    .then(response => {
        if (!response.ok) throw Error(response.status);
        return response.json();
    })
    .then((universities) => {
        universities.forEach((university) => {
            universitiesMenu.innerHTML += `<li><a class="dropdown-item" href="/universidad/${university.id}/facultades">${university.name}</a></li>`
        })
    })
    .catch(error => console.error(error))
})