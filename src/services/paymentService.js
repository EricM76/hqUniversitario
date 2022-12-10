const axios = require("axios");
const process = require("process");

const paymentService = {
  createPayment: async () => {
    const url = "https://api.mercadopago.com/checkout/preferences";
    const body = {
      payer_email: "test_user_46945293@testuser.com",
      items: [
        {
          title: "Dummy Title",
          description: "Dummy description",
          picture_url: "http://www.myapp.com/myimage.jpg",
          category_id: "category123",
          quantity: 1,
          unit_price: 10
        }
      ],
      back_urls: {
        failure: "/suscripciones/failure",
        pending: "/suscripciones/pending",
        success: "/suscripciones/success"
      }
    };
    const payment = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    });
    return payment.data;
  },
  createSubscription: async ({payer_email, reason, transaction_amount, userId}) => {
    const url = `${process.env.API_MP}/preapproval`;

    const body = {
      /* preapproval_plan_id: "2c9380848451e648018454b44601038b", */
      reason,
      external_reference: userId,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount,
        currency_id: "ARS"
      },
      back_url: "https://hquniversitario.com",
      payer_email: "test_user_76198889@testuser.com"
    };

    const subscription = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    });

    return subscription.data;
  },
  getPaymentById: async(paymentId) => {
    const url = `${process.env.API_MP}/v1/payments/${paymentId}`
    const payment = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    });

    return payment.data;
  },
  getSubscriptionPreapproval: async (preapprovalId) => {
    const url = `${process.env.API_MP}/preapproval/${preapprovalId}`
    const payment = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    });

    return payment.data;
  },
  getPaymentByUserId: async (userId) => {
    /* https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&external_reference=3 */
    const url = `${process.env.API_MP}/v1/payments/search?sort=date_created&criteria=desc&external_reference=${userId}`
    const payment = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    });

    return payment.data.results;
  }
}

module.exports = paymentService;