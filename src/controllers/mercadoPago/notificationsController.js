const db = require("../../database/models");
const { getAuthorizedPayments } = require("../../services/paymentService");

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
    const { id, type, data } = req.body;
    try {
      const notification = await db.Notification.create({
        notificationId: id,
        type,
        paymentId: data.id,
      });
        /* 
        Estructura del payment
            {
              "id": 6114264375, //Identificador único de factura.
              "type": "scheduled", //Tipo de factura generada en base a la recurrencia.
              "date_created": "2022-01-01T11:12:25.892-04:00",
              "last_modified": "2022-01-01T11:12:25.892-04:00", //Fecha de última modificación de la factura. Una factura se modifica cuando se produce una actualización en los intentos de cobro o pago.
              "preapproval_id": "2c938084726fca480172750000000000", //ID de suscripción para el que se creó la factura.
              "reason": "Yoga classes",
              "external_reference": 23546246234, //Referencia para sincronizar con tu sistema. Este es un campo de texto libre para ayudarte con tu integración para vincular las entidades.
              "currency_id": "ARS",
              "transaction_amount": 10,
              "debit_date": "2022-01-01T11:12:25.892-04:00", //Fecha en la que intentaremos realizar el pago.
              "retry_attempt": 4, //Cantidad de veces que intentaremos cobrar la factura.
              "status": "scheduled", Estado de la factura.
                        scheduled: Authorized payment scheduled to collect
                        processed: Authorized payment collected or exceeded retries
                        recycling: Authorized payment in attempt to collect
                        cancelled: Authorized payment canceled
              "summarized": "pending", Estado de resumen del resultado de la factura en la suscripción.
                        pending: Pending summary in the subscription.
                        done: Summarized result in the subscription.
              "payment": {
                "id": 19951521071,
                "status": "approved", //Estado del pago
                                      pending: The user has not yet completed the payment process
                                      approved: The payment has been approved and accredited
                                      authorized: The payment has been authorized but not captured yet
                                      in_process: Payment is being reviewed
                                      in_mediation: Users have initiated a dispute
                                      rejected: Payment was rejected. The user may retry payment
                                      cancelled: Payment was cancelled by one of the parties or because time for payment has expired
                                      refunded: Payment was refunded to the user
                                      charged_back: Was made a chargeback in the buyer’s credit card
                "status_detail": "accredited" //Detalle del estado de pago.
              }
            }
        */
        //return res.json(payment);
        return res.status(201).json({message: "Created"});
  
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
};
