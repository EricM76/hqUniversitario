module.exports = {
  type: {
    PAYMENT: "payment",
    SUBSCRIPTION_PREAPPROVAL: "subscription_preapproval",
    SUBSCRIPTION_AUTHORIZED_PAYMENT: "subscription_authorized_payment"
  },
  action: {
    SUBSCRIPTION_PREAPPROVAL_CREATED: "created",
    SUBSCRIPTION_PREAPPROVAL_UPDATED: "updated",
    SUBSCRIPTION_AUTHORIZED_PAYMENT_CREATED: "created",
    SUBSCRIPTION_AUTHORIZED_PAYMENT_UPDATED: "updated",
    PAYMENT_CREATED: "payment.created",
    PAYMENT_UPDATED: "payment.updated",
  },
};
