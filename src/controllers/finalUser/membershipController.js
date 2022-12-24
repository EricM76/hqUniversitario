const { format, differenceInDays, differenceInCalendarDays } = require("date-fns");
const db = require("../../database/models");
const { getActivesUserCourses } = require("../../services/userCoursesService");
const { getUserMembershipData, getMembershipData } = require("../../services/membershipService");
const { Op } = require("sequelize");
const { getPaymentById } = require("../../services/paymentService");
module.exports = {
    getById: async (req, res) => {
        const membershipId = req.params.membershipId;
        try {
            const membership = await db.Membership.findByPk(membershipId);

            return res.status(200).json(membership)
        } catch (error) {
            res.json(error)
        }
    },
    getByUserId: async (req, res) => {
        const userId = req.params.userId;
        try {
            const user = await db.User.findOne({
                where: {
                    id: userId
                },
                include: ["membership"]
            });

            const {data} = await getActivesUserCourses(userId);
            console.log(data)
            console.log(user.membership && user.membership.quota - data && data.total)
            console.log(user.membership)
            console.log(user.membership.quota - data.total)
            console.log(data.total)

            let quotasAvailable = null;
            if (user.membership) {
              quotasAvailable = user.membership.quota - data.total;
            }
            let date = new Date()
            let date1 = new Date(user.expires);
            let date2 = date;
           /*  console.log(date1.getTime())
            console.log(date2.getTime()) */
            let Difference_In_Time = date2.getTime() - date1.getTime();
            let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            /* console.log(Difference_In_Time)
            console.log(Difference_In_Days) */
            /* Nota, pensar en que si la diferencia resulta un numero negativo calcular el total de dias hasta el 31/12 y sumarle el total desde el 01/01 a la fecha de expiracion */
            const response = {
                membershipId: user.membershipId,
                expires: user.expires,
                daysToExpires: Math.abs(differenceInCalendarDays(date2, date1)),
                status: user.status,
                membershipName: user.membership && user.membership.name,
                freeMembership: user.freeMembership,
                membershipQuota: user.membership && user.membership.quota,
                activesUserCourses: data && data.total,
                quotasAvailable,
            }

            return res.status(200).json(response);
        } catch (error) {
            console.log(error)
            res.status(400).json({error: "Sin membresía"})
        }
    },
    change: async (req, res) => {
        try {
            const { daysToExpires, membershipId } = await getUserMembershipData(req.session.user.id);
            const currentMembership = await getMembershipData(membershipId);
            const { price, order, days, expires } = currentMembership;
            // Obtener todas las membresias con order mayor al actual 
            const memberships = await db.Membership.findAll({
                where: {
                  name: {
                    [Op.notLike]: "%FREE%",
                  },
                },
              });
            const sameDaysMemberships = memberships.filter(membership => membership.days === days && membership.order > order);
            const otherDaysMemberships = memberships.filter(membership => membership.days !== days && membership.order > order);

            const membershipsFirstGroup = sameDaysMemberships.map((membership) => {
                if(membership.days === days) {
                    const currentPricePerDay = Number(price) / days;
                    const membershipPricePerDay = Number(membership.price) / membership.days;
                    const difference = membershipPricePerDay - currentPricePerDay;
                    const cost = difference * daysToExpires;
                    membership.days = daysToExpires;
                    membership.price = Math.round(cost);
                }

                return membership
            })

            return res.render("finalUser/changeMembership", {
                session: req.session,
                currentMembership,
                membershipsFirstGroup,
                membershipsSecondGroup: otherDaysMemberships,
                daysToExpires
            })
        } catch (error) {
           return res.send(error)
        }    
    },
    changeState: async (req, res) => {
        const {
            collection_id,
            collection_status,
            payment_id,
            status,
            external_reference,
            preference_id,
          } = req.query;
          /*   failure: "http://localhost:3000/usuario/suscripcion/failure",
              pending: "http://localhost:3000/usuario/suscripcion/pending",
              success: */
          const paymentStatus = req.params.estado;
          if (paymentStatus === "success") {
            try {
              if (status === "approved") {
                const user = await db.User.findByPk(external_reference);
                const membership = await db.Membership.findOne({
                  where: {
                    order: user.pendingMembershipId
                  }
                });
                const date = new Date();
                const paymentInfo = await getPaymentById(payment_id);
      
                // si el pago existe en la db actualizarlo
                // si no, crearlo
                const payment = await db.Payment.findOne({
                  where: {
                    paymentId: payment_id,
                  }
                })
      
                if(payment){
                  db.Payment.update({
                    description: paymentInfo.description,
                    payerId: paymentInfo.payer.id, // Ver que onda -- NULL
                    payer_details: JSON.stringify(paymentInfo.payer),
                    payment_method_id: paymentInfo.payment_method_id,
                    status: paymentInfo.status,
                    status_detail: paymentInfo.status_detail,
                    transaction_amount: paymentInfo.transaction_amount,
                  }, {
                    where: {
                      id: payment.id
                    }
                  })
                } else {
                  await db.Payment.create({
                    paymentId: paymentInfo.id,
                    description: paymentInfo.description,
                    payer_email: paymentInfo.payer.email,
                    payerId: paymentInfo.payer.id,
                    payer_details: JSON.stringify(paymentInfo.payer),
                    payment_method_id: paymentInfo.payment_method_id,
                    status: paymentInfo.status,
                    status_detail: paymentInfo.status_detail,
                    transaction_amount: paymentInfo.transaction_amount,
                    hqUserId: paymentInfo.external_reference
                  });
                }
                const paymentApprovedDate = new Date(paymentInfo.date_approved);
                
                /* const membershipExpirationDate = formatISO(
                  add(paymentApprovedDate, {
                    days: membership.days,
                  }),
                  "dd/MM/yyyy"
                ); */
      
               //const formatToSaveExpirationDate = new Date(membershipExpirationDate);
      
                const updateUserSubscriptionStatus = await db.User.update(
                  {
                    subscriptionStatus: status,
                    confirmedSubscription: true,
                    status: true,
                    membershipId: membership.id,
                    freeMembership: false,
                    /* entry: date.toISOString(),
                    expires: membershipExpirationDate, */
                  },
                  {
                    where: {
                      id: user.id,
                    },
                  }
                );
      
                const userMembershipInfo = await getUserMembershipData(
                  req.session.user.id
                );
      
                const updatedUser = await db.User.findByPk(req.session.user.id);
                req.session.user = {
                  ...req.session.user,
                  membershipId: updatedUser.membershipId,
                  status: updatedUser.status,
                  //userActiveCourses,
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
              }
            } catch (error) {
             console.log(error)
            }
          } else {
            try {
              const updateUserSubscriptionStatus = await db.User.update(
                {
                  subscriptionId: preference_id,
                  subscriptionStatus: status,
                  //confirmedSubscription: true,
                },
                {
                  where: {
                    id: external_reference,
                  },
                }
              );
            } catch (error) {
              console.log(error);
            }
          }
          return res.render("finalUser/changeSubscriptionStatus", {
            session: req.session,
            paymentStatus,
          });
    }
}