const { format, add } = require("date-fns");
const db = require("../../database/models");
const {createSubscription, createPayment} = require("../../services/paymentService");

module.exports = {
    getPaymentLink: async (req, res) => {
      try {
        const payment = await createPayment({
          payer_email: req.session.user.email,
          title: "Membresia HQ",
          description: "Membresia Basic, acceso a 1 materia por 30 dias",
          price: 900,
          userId: req.session.user.id
        });
  
        return res.json(payment);
      } catch (error) {
        console.log(error);
  
        return res
          .status(500)
          .json({ error: true, msg: "Failed to create payment" });
      }
    },
    getSubscriptionLink : async (req, res) => {
      const membershipId = req.params.membershipId;
      try {
        const membership = await db.Membership.findByPk(membershipId);
        const dataSubscription = {
            payer_email: req.session.user.email,
            reason: `Suscripción a membresía ${membership.name}`,
            transaction_amount: membership.price,
            userId: req.session.user.id,
        }
        const subscription = await createSubscription(dataSubscription);
        const date_created = format(new Date(subscription.date_created), "dd/MM/yyyy")
        //const next_payment_date = format(new Date(subscription.next_payment_date), "dd/MM/yyyy")
        const date_end = format(add(new Date(subscription.date_created), {days: 30}), "dd/MM/yyyy")
        const updateUserSubscriptionStatus = await db.User.update({
          subscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          payerId: subscription.payer_id,
          confirmedSubscription: false,
          pendingMembershipId: membershipId
        }, {
          where: {
            id: req.session.user.id
          }
        })

        return res.render("finalUser/subscriptionConfirmation", {
            membership, 
            subscription,
            date_created,
            date_end,
            //next_payment_date,
            session: req.session
        });
      } catch (error) {
        console.log(error);
  
        return res
          .status(500)
          .json({ error: true, msg: "Failed to create subscription" });
      }
    },
    getSubscriptionDataByUserId : async (req, res) => {
      // PaymentId
      // Estado del pago
      // 
    }
  }