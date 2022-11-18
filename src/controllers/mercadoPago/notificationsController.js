const { add } = require("date-fns");
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
      });

      if( type === NOTIFICATION.type.PAYMENT) {
        if (action === NOTIFICATION.action.PAYMENT_CREATED) {
          const paymentInfo = await getPaymentById(data.id);
          const findedUser = await db.User.findOne({
            where: {
              payerId: paymentInfo.payer.id
            }
          })
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
            hqUserId: findedUser.id
          });
        }

        if (action === NOTIFICATION.action.PAYMENT_UPDATED) {
          const paymentInfo = await getPaymentById(data.id);
          const findedUser = await db.User.findOne({
            where: {
              payerId: paymentInfo.payer.id
            }
          })
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
            hqUserId: findedUser.id
          });
        }
      }
   
      return res.status(201).json({ message: "Created" });
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
};
