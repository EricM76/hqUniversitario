const isActiveCourses = (activeCourses = [], selectedCourses = []) => {
    const coursesFound = []; 

    activeCourses.forEach(activeCourse => {
        selectedCourses.forEach(selectedCourse => {
            if(activeCourse.courseId === selectedCourse.id) {
                coursesFound.push(selectedCourse)
            }   
        })
    })

    const response = {
        isActive: coursesFound.length > 0,
        coursesFound
    }

    return response;
}

module.exports = isActiveCourses;