/* 
1 - Verificar fecha de expiracion
2 - si expiró: 
    usuario: 
            - status: false
            - freeMembership: false?
            - entry: null
            - expires: null
            - membershipId: null
    userCourses:
            - active: false
*/

const { isToday } = require("date-fns");
const db = require("../database/models");
const { getUserMembershipData } = require("../services/membershipService");

const userMembershipExpirationCheck = async (req, res, next) => {
  if (req.session.user) {
    const { status, membershipId } = req.session.user;
    console.log(status)

    if(status && membershipId){
        const { data } = await getUserMembershipData(
            req.session.user.id
          );
        const { expires } = data;
        if (isToday(new Date(expires))) {
          try {
            let updateUser = await db.User.update(
              {
                status: false,
                freeMembership: false,
                entry: null,
                expires: null,
                membershipId: null,
              },
              {
                where: {
                  id: req.session.user.id,
                },
              }
            );
    
            let updateUserCourse = await db.UserCourse.update(
              {
                active: false,
              },
              {
                where: {
                  userId: req.session.user.id,
                },
              }
            );
    
            if(updateUser && updateUserCourse) {
                const { data } = await getActivesUserCourses(req.session.user.id);
                const { data: userMembershipInfo } = await getUserMembershipData(
                  req.session.user.id
                );
                if(userMembershipInfo.error !== undefined){
                    const { expires, membershipId } = userMembershipInfo;
        
                    req.session.user = {
                        ...req.session.user,
                      membershipId,
                      userMembershipExpiresDate: expires,
                      userActiveCourses: data.activeUserCourses,
                    };
                }
              
            }
           
          } catch (error) {
            console.log(error)
          }
        }
    }
    
  }
  next();
};

module.exports = userMembershipExpirationCheck;
