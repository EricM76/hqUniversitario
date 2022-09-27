const db = require("../../database/models");
const {createSubscription} = require("../../services/paymentService");

module.exports = {
    getSubscriptionLink : async (req, res) => {
      const membershipId = req.params.membershipId;
      try {
        const membership = await db.Membership.findByPk(membershipId);
        const dataSubscription = {
            payer_email: req.session.user.email,
            reason: `Suscripción a membresía ${membership.name}`,
            transaction_amount: membership.price,
        }
        const subscription = await createSubscription(dataSubscription);

        return res.render("finalUser/subscriptionConfirmation", {
            membership, 
            subscription,
            session: req.session
        });
      } catch (error) {
        console.log(error);
  
        return res
          .status(500)
          .json({ error: true, msg: "Failed to create subscription" });
      }
    }
  }