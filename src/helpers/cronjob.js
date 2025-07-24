const cron = require('node-cron');
const { handleError } = require('./response');
const { ConnectionRequest } = require('../api/connectionRequest/connectionRequest.model');
const { subDays, startOfDay, endOfDay } = require('date-fns');
const sendEmail = require('../helpers/sendEmail')


function chunkArray(array, size) {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
        chunked.push(array.slice(i, i + size));
    }
    return chunked;
}
  
cron.schedule('0 47 11 * * *', async () => {
    try {
        const fromDate = startOfDay(subDays(new Date(), 30));
        const toDate = new Date();

        const pendingRequests = await ConnectionRequest.find({
            status: "Interested",
            createdAt: {
                '$gte': fromDate,
                '$lte': toDate
            }
        }).populate("fromUserId toUserId");

        console.log(`📨 Total pending requests: ${pendingRequests.length}`);

        const batches = chunkArray(pendingRequests, 2); // batch of 5 emails
        for (const batch of batches) {
            const emailPromises = batch.map(async (request) => {
                const sender = request.fromUserId;
                const receiver = request.toUserId;

                try {

                    const res = await sendEmail.run(
                        "pashanwinsty1998@gmail.com", //receiver.email,
                        "sender@devmatrimony.in",
                        sender.firstName,
                        receiver.firstName,
                    );
                } catch (error) {
                    console.log(`❌ Email failed to ${receiver.email}`, error.message);
                }
            });

            await Promise.all(emailPromises); // run batch in parallel

            // Optional: delay between batches to avoid rate limits
            await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 sec pause
        }

    } catch (error) {
        console.log('❌ Error in CRON batch job:', error);
    }
});