
const express = require("express");
const router = express.Router();

const {getSubscriptionLink, getPaymentLink, getPaymentLinkToChangeMembership} = require("../../controllers/mercadoPago/paymentController");
const {notifications} = require("../../controllers/mercadoPago/notificationsController");

router.get("/", (req, res, next) => {
  return res.json({
    "/payment": "generates a payment link",
    "/subscription": "generates a subscription link"
  });
});

router.get("/:membershipId", getPaymentLink);
router.post("/changeMembership", getPaymentLinkToChangeMembership);
router.post("/notifications", notifications);

module.exports = router;