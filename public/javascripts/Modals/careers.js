const modalTitle = document.querySelector("#modalTitle");
const modalSubtitle = document.querySelector("#modalSubtitle");
const modalBody = document.querySelector(".modal-body");
const ul = document.createElement("ul");
        ul.classList.add("list-group", "list-group-flush");
        ul.id = "coursesList"
        modalBody.appendChild(ul);

const showCareerContent = (id) => {
    const request = new Request(`/api/career?career=${id}`);
    fetch(request)
    .then(response => {
        if (!response.ok) throw Error(response.status);
        return response.json();
    })
    .then((career) => {
        modalTitle.innerText = `${career.name}`;
        modalSubtitle.innerText = `${career.university.acronym} - ${career.faculty.acronym}`
        career.courses.push({id: 1, name: "Matematicas" })
        ul.innerHTML = ""
        career.courses.forEach(course => {
            ul.innerHTML += `
            <li class="list-group-item university__school-itemContainer">
                <a href="/materia/presentacion/${course.id}">${course.name}</a>
            </li>
            `
        });
    })
    .catch(error => console.error(error))
}