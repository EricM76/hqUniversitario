const db = require("../../database/models");

module.exports = {
    notifications: (req, res) => {
      /*
      1- Recibir la notificación con el siguiente formato 
      {
        "id": 12345,
        "live_mode": true,
        "type": "payment",
        "date_created": "2015-03-25T10:04:58.396-04:00",
        "application_id": 123123123,
        "user_id": 44444,
        "version": 1,
        "api_version": "v1",
        "action": "payment.created",
        "data": {
            "id": "999999999"
        }
      }
      2- Retornar 200 o 201
      3- MP recibe la respuesta y pone disponible los datos del pago
      4- Consultar la API (https://api.mercadopago.com/authorized_payments)
      5- Guardar el resultado final (actualizar el status de la membresía).
    */


    }
}