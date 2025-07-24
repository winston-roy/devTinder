const razorpayInstance = require('../../helpers/razorpay');
const { respondWithResult, handleError } = require('../../helpers/response');
const { Payment } = require('../payment/payment.model');
const { membershipAmount } = require('../../config/api-constants');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const { User } = require('../auth/auth.model');

async function createOrder(req, res) {
    try {
        const { membershipType } = req.body;
        const { firstName, lastname, email, phoneNumber } = req.user;
        // create order
        const order = await razorpayInstance.orders.create({
            amount: membershipAmount[membershipType] * 100,
            currency: "INR",
            receipt: "order_rcptid_11",
            notes: {
                firstName,
                lastname,
                email,
                phoneNumber,
                membershipType
            }
        })

        //save it to DB
        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            amount_paid: order.amount_paid,
            currency: order.currency,
            notes: order.notes,
            receipt: order.receipt
        })

        const savePayment = await payment.save();



        //return back to my order details

        respondWithResult(res, {
            message: "Payment Successfull",
            data: { ...savePayment.toJSON(), keyId: process.env.RAZOR_PAY_KEY_ID }
        });

    } catch (error) {
        handleError(res, error);
    }

}

async function createWebhook(req, res) {
    try {
        const webhookSignature = req.get('X-Razorpay-Signature')
        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZOR_WEBHOOK_SECRET
        )

        if (!isWebhookValid) {
            handleError(res, {
                'name': 'Webhook Signature Error',
                'message': 'Invalid Webhook Signature !!!'
            })
        }

        //update payment status in DB
        const paymentDetails = req.body.payload.payment.entity;

        const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
        payment.status = paymentDetails.status; //either capture / failed
        await payment.save();

        //Update use as premium
        const user = await User.findOne({ _id: payment.userId });
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        user.save();

        

        // if (req.body.event === 'payment.captured') {

        // }

        // if (req.body.event === 'payment.failed') {

        // }
        //return success response to razorpay
        respondWithResult(res, {
            'message': 'Webhook Received Successfully',
            'data': isWebhookValid
        });
    } catch (error) {
        handleError(res, error);
    }
}

async function premiumVerify(req, res) {
    try {
        const user = req.user.toJSON();
        if (user.isPremium) {
            respondWithResult(res, {
                'message': 'Premium Purchase Successfull',
                'data': { isPremium: true }
            });
        } else {
            respondWithResult(res, {
                'message': 'Premium Purchase Failed',
                'data': { isPremium: false }
            });
        }
    } catch (error) {
        handleError(res, error);
    }
}

module.exports = {
    handler: {
        createOrder,
        createWebhook,
        premiumVerify
    }
}