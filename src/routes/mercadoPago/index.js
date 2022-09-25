
const express = require("express");
const router = express.Router();

const {getSubscriptionLink} = require("../../controllers/mercadoPago/paymentController");

router.get("/", (req, res, next) => {
  return res.json({
    "/payment": "generates a payment link",
    "/subscription": "generates a subscription link"
  });
});

router.get("/:membershipId", getSubscriptionLink);
router.post("/notifications", getSubscriptionLink);

module.exports = router;