const { add, formatISO } = require("date-fns");
const db = require("../../database/models");
const {
  getAuthorizedPayments,
  getPaymentById,
} = require("../../services/paymentService");
const NOTIFICATION = require("../../constants/notification.constants");
const { getUserInSessionData } = require("../../services/userService");

module.exports = {
  notifications: async (req, res) => {
    const { 
      id, 
      type, 
      data, 
      action, 
      live_mode, 
      date_created, 
      application_id,
      user_id,
      version,
      api_version
    } =
      req.body;
    try {
      const saveNotification = await db.Notification.create({
        notificationId: id,
        type,
        data: JSON.stringify(data),
        action,
        live_mode,
        date_created,
        application_id,
        user_id,
        version,
        api_version,
        paymentId: data.id,
      });

      if( type === NOTIFICATION.type.PAYMENT) {
        if (action === NOTIFICATION.action.PAYMENT_CREATED) {
          const paymentInfo = await getPaymentById(data.id);
         /*  const findedUser = await db.User.findOne({
            where: {
              payerId: paymentInfo.payer.id
            }
          }) */
          const savedPayment = await db.Payment.create({
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

          const user = await db.User.findByPk(paymentInfo.external_reference);
          const membership = await db.Membership.findOne({
            where: {
              order: user.pendingMembershipId
            }
          });
          const date = new Date();

          if (paymentInfo.status === "approved") {
            const paymentApprovedDate = new Date(paymentInfo.date_approved);

            const membershipExpirationDate = formatISO(
              add(paymentApprovedDate, {
                days: membership.days,
              }),
              "dd/MM/yyyy"
            );
  
            const updateUserSubscriptionStatus = await db.User.update(
              {
                subscriptionStatus: "approved",
                confirmedSubscription: true,
                status: true,
                membershipId: membership.id,
                freeMembership: false,
                entry: date.toISOString(),
                expires: membershipExpirationDate,
              },
              {
                where: {
                  id: user.id,
                },
              }
            );
          } else {
            const updateUserSubscriptionStatus = await db.User.update(
              {
                subscriptionId: paymentInfo.id,
                subscriptionStatus: paymentInfo.status,
                //confirmedSubscription: true,
              },
              {
                where: {
                  id: paymentInfo.external_reference,
                },
              }
            );
          }
        }

        if (action === NOTIFICATION.action.PAYMENT_UPDATED) {
          const paymentInfo = await getPaymentById(data.id);
          const updatePayment = await db.Payment.update({
            description: paymentInfo.description,
            payerId: paymentInfo.payer.id, // Ver que onda -- NULL
            payer_details: JSON.stringify(paymentInfo.payer),
            payment_method_id: paymentInfo.payment_method_id,
            status: paymentInfo.status,
            status_detail: paymentInfo.status_detail,
            transaction_amount: paymentInfo.transaction_amount,
          }, {
            where: {
              paymentId: paymentInfo.id
            }
          });

          const user = await db.User.findByPk(paymentInfo.external_reference);
          const membership = await db.Membership.findOne({
            where: {
              order: user.pendingMembershipId
            }
          });
          const date = new Date();


          if (paymentInfo.status === "approved") {
            const paymentApprovedDate = new Date(paymentInfo.date_approved);

            const membershipExpirationDate = formatISO(
              add(paymentApprovedDate, {
                days: membership.days,
              }),
              "dd/MM/yyyy"
            );
  
            const updateUserSubscriptionStatus = await db.User.update(
              {
                subscriptionStatus: "approved",
                confirmedSubscription: true,
                status: true,
                membershipId: membership.id,
                freeMembership: false,
                entry: date.toISOString(),
                expires: membershipExpirationDate,
              },
              {
                where: {
                  id: user.id,
                },
              }
            );
          } else {
            const updateUserSubscriptionStatus = await db.User.update(
              {
                subscriptionId: paymentInfo.id,
                subscriptionStatus: paymentInfo.status,
                //confirmedSubscription: true,
              },
              {
                where: {
                  id: paymentInfo.external_reference,
                },
              }
            );
          }
        }
      }
   
      return res.status(201).json({ message: "Created" });
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
};
