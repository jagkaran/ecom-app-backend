"use strict";
const stripe = require("stripe")(
  "sk_test_51HUV7oAuvJIPCGvz6rZBD88G8rZrvK3UwAbOsx7lGh1xqzh9d5yA9DVDl9jElfHmHUxfx0UnpaSIoKRuHI9TUX1X00wQk0m41N"
);

module.exports = {
  create: async (ctx) => {
    const {
      address,
      amount,
      dishes,
      postalCode,
      token,
      city,
    } = ctx.request.body;

    // Charge the customer
    try {
      await stripe.charges.create({
        // Transform cents to dollars.
        amount: amount * 100,
        currency: "inr",
        description: `Order ${new Date()} by ${ctx.state.user.id}`,
        source: token,
      });

      // Register the order in the database
      try {
        const order = await strapi.services.order.create({
          user: ctx.state.user.id,
          address,
          amount,
          dishes,
          postalCode,
          city,
        });

        return order;
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
    }
  },
};
