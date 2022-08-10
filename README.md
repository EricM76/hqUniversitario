# Proyecto HQ Apoyo Universitario
> Developed by Eric & Jonatan
## Indice
- [Proyecto HQ Apoyo Universitario](#proyecto-hq-apoyo-universitario)
  - [Indice](#indice)
  - [Información General](#información-general)
  - [Screenshots](#screenshots)
  - [Dependencias](#dependencias)
  - [Instalación](#instalación)
  - [Base de datos](#base-de-datos)
    - [Crear la base de datos con **migraciones**](#crear-la-base-de-datos-con-migraciones)
  - [Levantar el servidor en local](#levantar-el-servidor-en-local)
  - [Deploy](#deploy)
## Información General
***
Siio web creado con Node y Express que ofrece contenido audiovisual que sirve de apoyo para los estudiantes universitarios usando la modalidad Fremium, es decir, parte del contenido es de acceso libre y gratuíto, no obstante para acceder a todo el contenido se ofrece un servicio de suscripción.
## Screenshots

![Home]()
![Home]()

## Dependencias
***
Dependencias utilizadas en el proyecto:
    [bcryptjs](https://www.npmjs.com/package/bcryptjs): "^2.4.3",
    [bootstrap](https://www.npmjs.com/package/bootstrap): "^5.1.3",
    [cookie-parser](https://www.npmjs.com/package/cookie-parser): "~1.4.4",
    [create-html](https://www.npmjs.com/package/create-html): "^4.1.0",
    [debug](https://www.npmjs.com/package/debug): "~2.6.9",
    [dotenv](https://www.npmjs.com/package/dotenv): "^10.0.0",
    [ejs](https://www.npmjs.com/package/ejs): "~2.6.1",
    [express](https://www.npmjs.com/package/express): "~4.16.1",
    [express-session](https://www.npmjs.com/package/express-session): "^1.17.2",
    [express-validator](https://www.npmjs.com/package/express-validator): "^6.14.0",
    [http-errors](https://www.npmjs.com/package/http-errors): "~1.6.3",
    [method-override](https://www.npmjs.com/package/method-override): "^3.0.0",
    [moment](https://www.npmjs.com/package/moment): "^2.29.1",
    [morgan](https://www.npmjs.com/package/morgan): "~1.9.1",
    [multer](https://www.npmjs.com/package/multer): "^1.4.4",
    [mysql2](https://www.npmjs.com/package/mysql2): "^2.3.3",
    [Node-Sass](https://www.npmjs.com/package/node-sass): "^7.0.1",
    [sequelize](https://www.npmjs.com/package/sequelize): "^6.12.5",
## Instalación
***
Clonar el proyecto e instalar las dependencias
```
$ git clone https://github.com/EricM76/hq
$ cd hq
$ npm install

```
Crear el archivo <code>.env</code> con las siguientes claves:
```
DB_DEV_USERNAME=
DB_DEV_PASSWORD=
DB_DEV_DATABASE=hq_db
DB_DEV_PORT=
```
## Base de datos
***
### Crear la base de datos con **migraciones**
Es necesario tener instalado [sequelize-cli](https://www.npmjs.com/package/sequelize-cli)
```
$ npm install --save-dev sequelize-cli
```
Correr migraciones y seeders
```
$ sequelize db:create
$ sequelize db:migrate
$ sequelize db:seed:all
```
## Levantar el servidor en local
***
- Se recomienda tener instalado [nodemon](https://www.npmjs.com/package/nodemon)
- Desde la terminal abierta en la carpeta del proyecto ejecutar <code> npm run dev </code> Esto pondrá en ejecución Node-Sass para trabajar los estilos de css con Sass y levantará el servidor con Nodemon
## Deploy
***
