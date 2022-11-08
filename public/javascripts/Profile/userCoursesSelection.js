const universitySelect = document.querySelector("#university");
const facultySelect = document.querySelector("#faculty");
const careerSelect = document.querySelector("#career");
const coursesContainer = document.querySelector("#coursesContainer");
const selectedCoursesContainer = document.querySelector("#selectedCoursesContainer");
const btnClear = document.querySelector("#btn-clear");
const btnCoursesConfirm = document.querySelector("#btnCoursesConfirm");
const params = new URLSearchParams(document.location.search);
const userId = params.get("userId");
const BASE_URL = window.location.origin;
let userMembershipQuota;
let userQuotasAvailable;

const $ = e => document.getElementById(e)

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
    btnCoursesConfirm.disabled = true;
    localStorage.clear();
    /* let coursesInStorage = localStorage.getItem("selectedCourses");
    if(coursesInStorage !== null) {
        coursesInStorage = JSON.parse(coursesInStorage);
        selectedCoursesContainer.innerHTML = ""
        coursesInStorage.forEach((course) => {
            selectedCoursesContainer.innerHTML += selectedCourseItemGenerator(course)
        })
    } */

    /* Obtener universidades y listarlas en el select */
    try {
        const universities = await doFetch(`${BASE_URL}/api/university`);
        universitySelect.innerHTML = "<option value='' selected hidden>Elige la universidad</option>";
        universities.forEach(university => {
            universitySelect.innerHTML += `<option value="${university.id}">${university.name}</option>` 
        });

        facultySelect.disabled = true;
        careerSelect.disabled = true;
    } catch (error) {
        console.error(error);
    }

    /* Obtener los cupos disponibles del usuario en sesion */
    try {
        const { quotasAvailable, membershipQuota } = await doFetch(`${BASE_URL}/membresias/usuario/${userId}`);
        userMembershipQuota = membershipQuota;
        userQuotasAvailable = quotasAvailable;
    } catch (error) {
        console.error(error);
    }
})

const addCourse = (courseId) => {
    const selectedCourse = careerCourses.find(course => Number(course.id) === Number(courseId))
    let coursesInStorage = localStorage.getItem("selectedCourses") ? JSON.parse(localStorage.getItem("selectedCourses")) : [];
    let courseIsInStorage = (course, coursesInStorage) => {
        let findCourse = coursesInStorage.find((item) => item.id === course.id);
        return typeof findCourse !== "undefined";
    }
    if (coursesInStorage.length == userQuotasAvailable) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No puedes elegir más materias',
          })
    } 

    if (courseIsInStorage(selectedCourse, coursesInStorage)) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Materia ya seleccionada',
          })
          return;
    } 

    if(coursesInStorage.length > 0 && coursesInStorage.length < userQuotasAvailable) {
        coursesInStorage.push(selectedCourse);
        selectedCoursesContainer.innerHTML = ""
        coursesInStorage.forEach((course) => {
            selectedCoursesContainer.innerHTML += selectedCourseItemGenerator(course)
        })
        coursesInStorage = JSON.stringify(coursesInStorage);
        localStorage.removeItem("selectedCourses");
        localStorage.setItem("selectedCourses", coursesInStorage);
        btnCoursesConfirm.disabled = false;
    }

    if (coursesInStorage.length == 0){
        localStorage.setItem("selectedCourses", JSON.stringify([selectedCourse]));
        coursesInStorage = JSON.parse(localStorage.getItem("selectedCourses"))
        selectedCoursesContainer.innerHTML = ""
        coursesInStorage.forEach((course) => {
            selectedCoursesContainer.innerHTML += selectedCourseItemGenerator(course)
        })
        btnCoursesConfirm.disabled = false;
    } 
}

const removeSelectedCourse = (courseId) => {
    const coursesInStorage = JSON.parse(localStorage.getItem("selectedCourses"));
    const listWithoutRemovedCourse = coursesInStorage.filter(course => course.id !== Number(courseId))
    btnCoursesConfirm.disabled = !listWithoutRemovedCourse.length;

    localStorage.setItem("selectedCourses", JSON.stringify(listWithoutRemovedCourse));

    selectedCoursesContainer.innerHTML = ""
    listWithoutRemovedCourse.forEach((course) => {
        selectedCoursesContainer.innerHTML += selectedCourseItemGenerator(course)
    })
} 

const courseItemGenerator = (course) => {
    return `<div class="col-12 col-lg-6 p-2">
    <div class="card">
        <div class="card-body d-flex justify-content-between align-items-center gap-2 p-3">
            <a href="/materia/presentacion/${course.id}" target="_blank">${course.name}</a>
            <button id="${course.id}" class="btn btn-outline-success" onclick="addCourse(${String(course.id)})">Agregar</button>
        </div>
    </div>
       
    </div>`
}

const selectedCourseItemGenerator = (course) => {
    return `<div class="col-12 p-2">
    <div class="card">
        <div class="card-body d-flex justify-content-between align-items-center gap-2 p-3">
                <span>${course.name}</span>
                <button id="${course.id}" onclick="removeSelectedCourse(${String(course.id)})" class="btn btn-outline-danger">Quitar</button>
        </div>
        </div>
    </div>`
}

const confirmSelectedCourses = async (data) => {
    try {
        const response = await fetch("/usuario/materia/agregar", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
              },
        });

        const result = await response.json();
        return result;
        
    } catch (error) {
        return error;
    }

}

universitySelect.addEventListener("change", async (event) => {
    const selectedUniversityId = event.target.value;
    facultySelect.innerHTML = "<option value='' selected hidden>Elige facultad</option>";
    try {
        const faculties = await doFetch(`${BASE_URL}/faculties/get-by-university?universityId=${selectedUniversityId}`);
        faculties.data.forEach(faculty => {
            facultySelect.innerHTML += `<option value="${faculty.id}">${faculty.name}</option>` 
        })
        universitySelect.disabled = true;
        facultySelect.disabled = false;
        $('step01').classList.remove('text-bg-dark')
        $('step01').classList.add('text-bg-secondary')
        $('step02').classList.toggle('text-bg-dark')

    } catch (error) {
        console.error(error);
    }
})

facultySelect.addEventListener("change", async (event) => {
    const selectedFacultyId = event.target.value;
    careerSelect.innerHTML = "<option hidden selected value=''>Elige carrera</option>";
    try {
        const careers = await doFetch(`${BASE_URL}/careers/get-by-faculty?facultyId=${selectedFacultyId}`);
        careers.data.forEach(career => {
            careerSelect.innerHTML += `<option value="${career.id}">${career.name}</option>` 
        })
        facultySelect.disabled = true;
        careerSelect.disabled = false;
        $('step02').classList.toggle('text-bg-dark')
        $('step03').classList.toggle('text-bg-dark')
    } catch (error) {
        console.error(error);
    }
})

careerSelect.addEventListener("change", async (event) => {
    const selectedCareerId = event.target.value;
    coursesContainer.innerHTML = "";
    try {
        const career = await doFetch(`${BASE_URL}/api/career?career=${selectedCareerId}`);
        if (career.courses.length > 0) {
            coursesWrapper.classList.remove("d-none")
            careerCourses = career.courses;
            career.courses.forEach(course => {
                coursesContainer.innerHTML += courseItemGenerator(course);
            })
        }
        careerSelect.disabled = true;
        $('step03').classList.toggle('text-bg-dark')
        $('step04').classList.toggle('text-bg-dark')
    } catch (error) {
        console.error(error);
    }
})

btnClear.addEventListener("click", async () => {
    universitySelect.disabled = false;
    const universities = await doFetch(`${BASE_URL}/api/university`);
    universitySelect.innerHTML = "<option hidden selected value=''>Elige universidad</option>";
    universities.forEach(university => {
        universitySelect.innerHTML += `<option value="${university.id}">${university.name}</option>` 
    });
    facultySelect.disabled = true;
    facultySelect.innerHTML = "<option hidden selected value=''>Elige facultad</option>";
    careerSelect.disabled = true;
    careerSelect.innerHTML = "<option hidden selected value=''>Elige carrera</option>";
    coursesContainer.innerHTML = "";
    
    $('step01').classList.remove('text-bg-secondary')
    $('step01').classList.add('text-bg-dark')
    $('step02').classList.remove('text-bg-dark')
    $('step03').classList.remove('text-bg-dark')
    $('step04').classList.remove('text-bg-dark')
    btnCoursesConfirm.disabled = true;


})

btnCoursesConfirm.addEventListener("click", async () => {
    if (localStorage.getItem("selectedCourses") === null) {
        Swal.fire({
            icon: 'error',
            title: 'Oops',
            text: "No elegiste materias",
          })
    }
    const selectedCourses = JSON.parse(localStorage.getItem("selectedCourses"));
    const data = {
        selectedCourses
    }

    Swal.fire({
        title: 'Confirmar materias',
        text: "Una vez confirmadas no podras cambiarlas hasta la próxima renovación",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar'
      }).then( async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await confirmSelectedCourses(data);
                if(response.status !== 400) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Felicitaciones',
                        text: response.message,
                    })
                    
                    localStorage.clear()
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000);
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops',
                        text: response.message,
                      });
                }
            } catch (error) {
                console.log(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops',
                    text: error.msg,
                  });
            }
        }
    })

})