const db = require("../../database/models");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

module.exports = {
  login: (req, res) => {
    res.render("finalUser/userLogin");
  },
  processLogin: (req, res) => {
    let errors = validationResult(req);
    if (errors.isEmpty()) {
      db.User.findOne({
        where: {
          email: req.body.email,
        },
      })
        .then((user) => {
          req.session.user = {
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            rol: user.rolId,
            membershipId: user.membershipId,
          };
          if (req.body.sessionCheck) {
            const TIME_IN_MILISECONDS = 60000;
            res.cookie("hq", req.session.user, {
              expires: new Date(Date.now() + TIME_IN_MILISECONDS),
              httpOnly: true,
              secure: true,
            });
          }

          res.locals.user = req.session.user;

          res.redirect("/");
        })
        .catch((error) => console.error(error));
    } else {
      res.render("finalUser/userLogin", {
        errors: errors.mapped(),
      });
    }
  },
  register: (req, res) => {
    res.render("finalUser/userRegister");
  },
  processRegister: (req, res) => {
     let errors = validationResult(req);
      
     if(errors.isEmpty()){
         db.User.create({
             name: req.body.name,
             email: req.body.email,
             password: bcrypt.hashSync(req.body.password, 10),
             rolId: 2,
             terms: 1,
         })
         .then((user) => {
             res.redirect("/usuario/login")
         })
         .catch(error => res.send(error))
     }else{
         res.render('finalUser/userRegister', {
             errors: errors.mapped(),
             old: req.body
         })
     }
  },
  logout: (req, res) => {
    req.session.destroy();

    if(req.cookies.hq){
        res.cookie('hq', "", { maxAge: -1 })
    }

    res.redirect('/');
  },
  profile: (req, res) => {
    fetch("https://apis.datos.gob.ar/georef/api/provincias")
    .then((res) => res.json())
    .then((data) => {
        db.User.findOne({
            where: {
                id: req.session.user.id
            },
            include: ["rols", "membership"],
        })
        .then((user) => {
            res.render("finalUser/userProfile", {
                user,
                provincias: data.provincias
            })
        })
    })
  },
};
