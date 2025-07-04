const Razorpay = require('razorpay');
console.log('key id', process.env.RAZOR_PAY_KEY_ID)
console.log('key secret', process.env.RAZOR_PAY_KEY_SECRET)
var instance = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_KEY_SECRET
});

module.exports = instance;