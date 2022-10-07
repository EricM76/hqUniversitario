const { format, add } = require("date-fns");
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
        const date_created = format(new Date(subscription.date_created), "dd/MM/yyyy")
        const date_end = format(add(new Date(subscription.date_created), {days: 30}), "dd/MM/yyyy")
        return res.render("finalUser/subscriptionConfirmation", {
            membership, 
            subscription,
            date_created,
            date_end,
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