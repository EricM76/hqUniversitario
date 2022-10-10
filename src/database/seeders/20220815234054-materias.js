'use strict';

const Courses =  [
  {
    name : 'Matemática para Ingreso',
    facultyId : 3, 
    universityId: 1,
    image: 'image-1665236116949.jpeg'
  },
  {
    name : 'Física para Ingreso',
    facultyId : 3, 
    universityId: 1,
    image: 'image-1665236614252.jpeg'
  },
  {
    name : 'Química para Ingreso',
    facultyId : 3, 
    universityId: 1,
    image : 'image-1665236739873.jpg'
  },
  {
    name : 'Introducción a la Matemática',
    facultyId : 3, 
    universityId: 1,
    image : 'image-1665237231667.webp'
  },
  {
    name : 'Química Aplicada',
    facultyId : 3, 
    universityId: 1,
    image : 'image-1665237327474.jpeg'
  },
  {
    name : 'Física I',
    facultyId : 3, 
    universityId: 1,
    image : 'image-1665237944974.jpeg'
  },
  {
    name : 'Análisis Matemático I',
    facultyId : 3, 
    universityId: 1,
    image : 'image-1665238065665.jpeg'
  },
  {
    name : 'Matemática para Biología y Geología',
    facultyId : 3, 
    universityId: 1,
    image : 'image-1665238235758.jpeg'
  },
  {
    name : 'Física',
    facultyId : 4, 
    universityId: 1,
    image : 'image-1665217685983.jpeg'
  },
  {
    name : 'Química',
    facultyId : 4, 
    universityId: 1,
    image : 'image-1665215057892.jpeg'
  },
  {
    name : 'Biología',
    facultyId : 4, 
    universityId: 1,
    image : 'image-1665212260022.jpeg'
  },
  {
    name : 'Introducción a la Medicina',
    facultyId : 4, 
    universityId: 1,
    image :'image-1665218759091.jpeg'
  },
  {
    name : 'Exámenes Integradores',
    facultyId : 4, 
    universityId: 1,
    image :'image-1665219140556.jpg'
  },
  {
    name : 'Introducción a las Ciencias Químicas',
    facultyId : 5, 
    universityId: 1,
    image : 'image-1665264693203.jpeg'
  },
  {
    name : 'Matemática I',
    facultyId : 5, 
    universityId: 1,
    image :'image-1665264940824.jpeg'
  },
  {
    name : 'Física I',
    facultyId : 5, 
    universityId: 1,
    image : 'image-1665265051103.jpeg'
  },
  {
    name : 'Química General I',
    facultyId : 5, 
    universityId: 1,
    image : 'image-1665265193379.jpeg'
  },
  {
    name : 'Ingreso a Arquitectura y Diseño Industrial',
    facultyId : 1, 
    universityId: 1,
    image : 'image-1665262887555.jpeg'
  },
  {
    name : 'Matemática 1A',
    facultyId : 1, 
    universityId: 1,
    image : 'image-1665263378897.jpeg'
  },
  {
    name : 'Matemática 1B',
    facultyId : 1, 
    universityId: 1,
    image : 'image-1665263157579.jpeg'
  },
  {
    name : 'Matemática 1C',
    facultyId : 1, 
    universityId: 1,
    image : 'image-1665263349207.jpeg'
  },
  {
    name : 'Física para Arquitectura y Diseño Industrial',
    facultyId : 1, 
    universityId: 1,
    image : 'image-1665263689212.jpeg'
  },
  {
    name : 'Matemática',
    facultyId : 2, 
    universityId: 1,
    image : 'image-1665263953517.jpeg'
  },
  {
    name : 'Economía',
    facultyId : 2, 
    universityId: 1,
    image : 'image-1665264101453.webp'
  },
  {
    name : 'Curso de Nivelación',
    facultyId : 6, 
    universityId: 1,
    image : 'image-1665266154696.jpeg'
  },
  {
    name : 'Análisis Matemático I',
    facultyId : 6, 
    universityId: 1,
    image : 'image-1665266274155.jpeg'
  },
  {
    name : 'Biología',
    facultyId : 7, 
    universityId: 2,
    image : 'image-1665266422420.webp'
  },
  {
    name : 'Física',
    facultyId : 7, 
    universityId: 2,
    image : 'image-1665266593708.jpeg'
  },
  {
    name : 'Química',
    facultyId : 7, 
    universityId: 2,
    image : 'image-1665266967668.webp'
  },
  {
    name : 'Matemática',
    facultyId : 8, 
    universityId: 3,
    image : 'image-1665267712012.jpeg'
  },
  {
    name : 'Física',
    facultyId : 8, 
    universityId: 3,
    image : 'image-1665268153546.jpeg'
  },
  {
    name : 'Biofísica',
    facultyId : 8, 
    universityId: 3,
    image : 'image-1665268388237.webp'
  },
  {
    name : 'Química',
    facultyId : 8, 
    universityId: 3,
    image : 'image-1665268651456.png'
  },
  {
    name : 'Matemática',
    facultyId : 9, 
    universityId: 3,
    image : 'image-1665269072126.webp'
  },
  {
    name : 'Física',
    facultyId : 9, 
    universityId: 3,
    image : 'image-1665269151347.webp'
  },
  {
    name : 'Biofísica',
    facultyId : 9, 
    universityId: 3,
    image : 'image-1665269483758.jpeg'
  },
  {
    name : 'Química',
    facultyId : 9, 
    universityId: 3,
    image : 'image-1665269318244.jpeg'
  },
]

const CoursesDB = Courses.map(course => {
  return {
    ...course,
    image : course.image ? course.image : 'exampleBanner.jpeg',
    video : null,
    description : null,
    review : null,
    teacherId : 1,
    visible : true,
    createdAt : new Date(),
    updatedAt : new Date()
  }
})


module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Courses', CoursesDB, {});
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('Courses', null, {});

  }
};
