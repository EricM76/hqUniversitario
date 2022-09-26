const universitySelect = document.querySelector("#university");
const facultySelect = document.querySelector("#faculty");
const careerSelect = document.querySelector("#career");
const coursesContainer = document.querySelector("#coursesContainer");

const courseItemGenerator = (course) => {
    return `<div class="col-12 col-md-6 p-2">
        <div class="d-flex justify-content-evenly align-items-center">
            <input type="checkbox" name="course" value="${course.id}" id="${course.name}">
            <label for="${course.name}">${course.name}</label>
            <a href="/materia/presentacion/${course.id}" class="btn btn-outline-secondary" target="_blank">Ver presentación</a>
        </div>
    </div>`
}

const doFetch = async (url) => {
    try {
        const request = await fetch(url);
        const response = await request.json();
        return response;
    } catch (error) {
        throw new Error(error)
    }
}

window.addEventListener("load", async() => {
    try {
        const universities = await doFetch("http://localhost:3000/api/university");
        universitySelect.innerHTML = "<option value=''>Elige universidad</option>";
        universities.forEach(university => {
            universitySelect.innerHTML += `<option value="${university.id}">${university.name}</option>` 
        });
    } catch (error) {
        console.error(error);
    }
})

universitySelect.addEventListener("change", async (event) => {
    const selectedUniversityId = event.target.value;
    facultySelect.innerHTML = "<option value=''>Elige facultad</option>";
    try {
        const faculties = await doFetch(`http://localhost:3000/faculties/get-by-university?universityId=${selectedUniversityId}`);
        faculties.data.forEach(faculty => {
            facultySelect.innerHTML += `<option value="${faculty.id}">${faculty.name}</option>` 
        })
    } catch (error) {
        console.error(error);
    }
})

facultySelect.addEventListener("change", async (event) => {
    const selectedFacultyId = event.target.value;
    careerSelect.innerHTML = "<option value=''>Elige facultad</option>";
    try {
        const careers = await doFetch(`http://localhost:3000/careers/get-by-faculty?facultyId=${selectedFacultyId}`);
        careers.data.forEach(career => {
            careerSelect.innerHTML += `<option value="${career.id}">${career.name}</option>` 
        })
    } catch (error) {
        console.error(error);
    }
})

careerSelect.addEventListener("change", async (event) => {
    const selectedCareerId = event.target.value;
    coursesContainer.innerHTML = "";
    try {
        const career = await doFetch(`http://localhost:3000/api/career?career=${selectedCareerId}`);

        career.courses.forEach(course => {
            coursesContainer.innerHTML += courseItemGenerator(course);
        })
    } catch (error) {
        console.error(error);
    }
})