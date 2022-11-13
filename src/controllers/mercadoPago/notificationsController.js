const { add } = require("date-fns");
const db = require("../../database/models");
const { getAuthorizedPayments, getPaymentById } = require("../../services/paymentService");

module.exports = {
  notifications: async (req, res) => {
    /*
        1- Recibir la notificación con el siguiente formato 
        {
          "id": 12345, -> ID de la notificación
          "live_mode": true,
          "type": "payment", -> Tipo de notificacion recebida (payments, mp-connect, subscription etc)
          "date_created": "2015-03-25T10:04:58.396-04:00",
          "application_id": 123123123, -> Application ID que recebió el recurso (payments, mp-connect, subscription etc)
          "user_id": 44444, -> UserID del vendedor
          "version": 1, -> Cantidad de veces que se envió una notificación
          "api_version": "v1", -> Indica si es una notificación duplicada o no
          "action": "payment.created", -> Tipo de notificación recibida, indicando si es la actualización de un recurso o bien la creación de un nuevo
          "data": {
              "id": "999999999" -> ID del payment o merchant_order
          }
        }
        2- Retornar 200 o 201
        3- MP recibe la respuesta y pone disponible los datos del pago
        4- Consultar la API (https://api.mercadopago.com/authorized_payments)
        5- Guardar el resultado final (actualizar el status de la membresía).
      */
    const { id, type, data, action } = req.body;
    const { id: paymentId } = data;
    try {
      const notification = await db.Notification.create({
        notificationId: id,
        type,
        action,
        paymentId,
      });

      if(action === "payment.created") {
        const paymentInfo = await getPaymentById(paymentId);

        if(paymentInfo.status === "approved"){
          const savedPayment = await db.Payment.create({
            paymentId: paymentInfo.id,
            description: paymentInfo.description,
            payer: JSON.stringify(paymentInfo.payer),
            payment_method_id: paymentInfo.payment_method_id,
            status: paymentInfo.status,
            status_detail: paymentInfo.status_detail,
            transaction_amount: paymentInfo.transaction_amount,
          })

          if(savedPayment){
            db.User.update({
              membershipId: 2,
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
