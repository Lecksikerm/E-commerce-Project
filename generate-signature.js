const crypto = require('crypto');

const payload = JSON.stringify({
  event: "charge.success",
  data: {
    reference: "as1n5x2udh",
    status: "success",
    amount: 700,
    currency: "NGN",
    customer: { email: "ademola@gmail.com" }
  }
});

const secret = "sk_test_b30a485d3e6eee5ae91328c1c45dceabebbfad35";

const signature = crypto.createHmac('sha512', secret).update(payload).digest('hex');

console.log("x-paystack-signature:", signature);