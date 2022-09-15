const db = require("../../database/models");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const axios = require("axios");

module.exports = {
  login: (req, res) => {
    return res.render("finalUser/userLogin", {
      session: req.session
    });
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

          return  res.redirect("/");
        })
        .catch((error) => console.error(error));
    } else {
      return res.render("finalUser/userLogin", {
        errors: errors.mapped(),
      });
    }
  },
  googleLogin: (req, res) => {
    let user = req.session.passport.user[0]

    req.session.user = {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      rol: user.rolId,
      googleId: user.social_id,
      membershipId: user.membershipId,
    }
    return res.redirect('/')
  },
  register: (req, res) => {
    return res.render("finalUser/userRegister",{session:req.session});
  },
  referred: (req, res) => {
     let errors = validationResult(req);
      
     if(errors.isEmpty()){
         db.Referred.create({
             name: req.body.name,
             email: req.body.email,
             userId: req.session.user.id,
             active: false,
         })
         .then((user) => {
          return res.redirect("/usuario/perfil")
         })
         .catch(error => res.send(error))
     }else{
      return res.render('finalUser/userRegister', {
             errors: errors.mapped(),
             old: req.body
         })
     }
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
            db.Referred.findOne({
              where: {
                email: user.email
              }
            })
            .then(referred => {
              if(referred){
                db.Referred.update({
                  active: true,
                }, {
                  where: {
                    id: referred.id
                  }
                })
                .then(()=>{
                  /* Enviar notificacion al usuario que lo refirió */
                  return res.redirect("/usuario/login")
                })
              }
              return res.redirect("/usuario/login")
            })
         })
         .catch(error => res.send(error))
     }else{
        return res.render('finalUser/userRegister', {
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

    return res.redirect('/');
  },
  profile: (req, res) => {
    const provincesPromise = axios.get("https://apis.datos.gob.ar/georef/api/provincias");
    const userPromise = db.User.findOne({where: {id: req.session.user.id},include: ["rol", "membership", "referreds"],});
    const membershipsPromise = db.Membership.findAll();
    Promise.all([provincesPromise, userPromise, membershipsPromise])
    .then(([{data}, user, memberships]) => {
    return res.render("finalUser/userProfile", {
          user,
          provincias: data.provincias,
          session:req.session,
          memberships
      })
    })
  },
  profileUpdate: (req, res) => {
    const userId = req.session.user.id;
    db.User.update({...req.body}, {where: {id: userId,}})
    .then((response) => {
      if(response){
        return  res.redirect("/usuario/perfil")
      }
    })
  },
};
