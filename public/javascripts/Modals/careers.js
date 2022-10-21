const modalTitle = document.querySelector("#modalTitle");
const modalSubtitle = document.querySelector("#modalSubtitle");
const modalBody = document.querySelector(".modal-body");
const ul = document.createElement("div");
        ul.classList.add("list-group");
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
        console.log(career)
        modalTitle.innerText = `${career.name}`;
        modalSubtitle.innerText = `${career.university.acronym} - ${career.faculty.acronym}`
        ul.innerHTML = "";
        let courses = career.courses.sort((a,b) => a.name > b.name ? 1 : a.name < b.name ? -1  : 0)
        courses.forEach(course => {
            ul.innerHTML += `
            <a class="list-group-item list-group-item-action"  href="/materia/presentacion/${course.id}"><i class="fas fa-check me-2"></i>${course.name}</a>
            `
        });
    })
    .catch(error => console.error(error))
}