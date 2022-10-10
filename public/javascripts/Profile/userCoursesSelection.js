const universitySelect = document.querySelector("#university");
const facultySelect = document.querySelector("#faculty");
const careerSelect = document.querySelector("#career");
const coursesContainer = document.querySelector("#coursesContainer");
const selectedCoursesContainer = document.querySelector("#selectedCoursesContainer");
const btnClear = document.querySelector("#btn-clear");

let careerCourses;

const addCourse = (courseId) => {
    const selectedCourse = careerCourses.find(course => Number(course.id) === Number(courseId))
    let coursesInStorage = localStorage.getItem("selectedCourses") ? localStorage.getItem("selectedCourses") : [];
    if(coursesInStorage) {
        coursesInStorage = JSON.parse(coursesInStorage);
        coursesInStorage.push(selectedCourse);
        coursesInStorage.forEach((course) => {
            selectedCoursesContainer.innerHTML += selectedCourseItemGenerator(course)
        })
        coursesInStorage = JSON.stringify(coursesInStorage);
        localStorage.removeItem("selectedCourses");
        localStorage.setItem("selectedCourses", coursesInStorage);
    } else {
        localStorage.setItem("selectedCourses", JSON.stringify([selectedCourse]));
        coursesInStorage.forEach((course) => {
            selectedCoursesContainer.innerHTML += selectedCourseItemGenerator(course)
        })
    }
}

const courseItemGenerator = (course) => {
    return `<div class="col-12 col-lg-6 p-2">
        <div class="d-flex justify-content-between align-items-center border rounded p-1">
            <a href="/materia/presentacion/${course.id}" target="_blank">${course.name}</a>
            <button id="${course.id}" class="btn btn-outline-success" onclick="addCourse(${String(course.id)})">Agregar</button>
        </div>
    </div>`
}
const selectedCourseItemGenerator = (course) => {
    return `<div class="col-12 col-lg-6 p-2">
        <div class="d-flex justify-content-between align-items-center border rounded p-1">
            <span>${course.name}</span>
            <button id="${course.id}" class="btn btn-outline-danger">Quitar</button>
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

        facultySelect.disabled = true;
        careerSelect.disabled = true;
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
        universitySelect.disabled = true;
        facultySelect.disabled = false;
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
        facultySelect.disabled = true;
        careerSelect.disabled = false;
    } catch (error) {
        console.error(error);
    }
})

careerSelect.addEventListener("change", async (event) => {
    const selectedCareerId = event.target.value;
    coursesContainer.innerHTML = "";
    try {
        const career = await doFetch(`http://localhost:3000/api/career?career=${selectedCareerId}`);
        if (career.courses.length > 0) {
            coursesWrapper.classList.remove("d-none")
            careerCourses = career.courses;
            career.courses.forEach(course => {
                coursesContainer.innerHTML += courseItemGenerator(course);
            })
        }
        careerSelect.disabled = true;
    } catch (error) {
        console.error(error);
    }
})

btnClear.addEventListener("click", async () => {
    universitySelect.disabled = false;
    const universities = await doFetch("http://localhost:3000/api/university");
    universitySelect.innerHTML = "<option value=''>Elige universidad</option>";
    universities.forEach(university => {
        universitySelect.innerHTML += `<option value="${university.id}">${university.name}</option>` 
    });
    facultySelect.disabled = false;
    facultySelect.innerHTML = "<option value=''>Elige facultad</option>";
    careerSelect.disabled = false;
    careerSelect.innerHTML = "<option value=''>Elige facultad</option>";
    coursesContainer.innerHTML = "";
})