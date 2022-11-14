const { add } = require("date-fns");
const db = require("../../database/models");
const { getAuthorizedPayments, getPaymentById } = require("../../services/paymentService");

module.exports = {
  notifications: async (req, res) => {
  
    const { id, type, data, action } = req.body;
    try {
      const notification = await db.Notification.create({
        notificationId: id,
        type,
        action,
        paymentId: data.id,
      });

      if(action === "payment.created") {
        const paymentInfo = await getPaymentById(data.id);

        if(paymentInfo.status === "approved"){
          const savedPayment = await db.Payment.create({
            paymentId: paymentInfo.id,
            description: paymentInfo.description,
            payer_email: paymentInfo.payer.email,
            payer_details: JSON.stringify(paymentInfo.payer),
            payment_method_id: paymentInfo.payment_method_id,
            status: paymentInfo.status,
            status_detail: paymentInfo.status_detail,
            transaction_amount: paymentInfo.transaction_amount,
          })

          // Obtener la membresia - point_of_interaction - transaction_data - plan_id
          // https://api.mercadopago.com/preapproval_plan/72f66a7dc93f47b7b08bc3e05bd83c88

          // Obtener suscripcion - point_of_interaction - transaction_data - subscription_id
          // https://api.mercadopago.com/preapproval/{subscriptionId}
          // next_payment_date
          let membershipId;
          let membershipTitle = paymentInfo.description.toLowerCase();
          switch (true) {
            case membershipTitle.includes("basic"):
              membershipId = 1;
              break;
            case membershipTitle.includes("pro"):
              membershipId = 2;
              break;
            case membershipTitle.includes("premium"):
              membershipId = 3;
              break;
            default:
              break;
          }

          if(savedPayment){
            db.User.update({
              membershipId,
              entry: new Date(),
              status: true,
              expires: add(new Date(), {days: 30}),
            },
            {
              where: {
                email: paymentInfo.payer.email
              }
            })
          }
        }
      }
      return res.status(201).json({message: "Created"});
  
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
};
