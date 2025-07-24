const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress, senderName, recipientName) => {

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f9f9f9;">
        <h2 style="color: #0066cc;">Connection Update from DevMatrimony</h2>

        <p>Hello <strong>${recipientName}</strong>,</p>

        <p>There has been an update regarding your connection with <strong>${senderName}</strong>.</p>

        <p>Please <a href="https://devmatrimony.in" style="color: #0066cc;">login to DevMatrimony</a> to view the details.</p>

        <br/>
        <p style="font-size: 12px; color: #888;">
        This is an automated email from <a href="https://devmatrimony.in" style="color: #888;">DevMatrimony.com</a>
        </p>
    </div>
`;



    return new SendEmailCommand({
        Destination: {
            ToAddresses: [toAddress],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: htmlContent,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: `${senderName} has sent you connection request on DevMatrimony.`,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: `New Connection Update from ${senderName}`,
            },
        },
        Source: fromAddress,
    });
};


const run = async (toEmail, fromEmail, senderName, recipientName, status) => {
    const sendEmailCommand = createSendEmailCommand(
        toEmail,
        fromEmail,
        senderName,
        recipientName,
        status
    );

    try {
        return await sesClient.send(sendEmailCommand);
    } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
            return caught;
        }
        throw caught;
    }
};

module.exports = { run };












// const { SendEmailCommand } = require("@aws-sdk/client-ses");
// const { sesClient } = require("./sesClient");

// const createSendEmailCommand = (toAddress, fromAddress) => {
//     return new SendEmailCommand({
//         Destination: {
//             /* required */
//             CcAddresses: [
//                 /* more items */
//             ],
//             ToAddresses: [
//                 toAddress,
//                 /* more To-email addresses */
//             ],
//         },
//         Message: {
//             /* required */
//             Body: {
//                 /* required */
//                 Html: {
//                     Charset: "UTF-8",
//                     Data: "<h1>HTML_FORMAT_BODY</h1>",
//                 },
//                 Text: {
//                     Charset: "UTF-8",
//                     Data: "this is TEXT_FORMAT_BODY",
//                 },
//             },
//             Subject: {
//                 Charset: "UTF-8",
//                 Data: "Hellow SES EMAIL_SUBJECT",
//             },
//         },
//         Source: fromAddress,
//         ReplyToAddresses: [
//             /* more items */
//         ],
//     });
// };
  
// const run = async () => {
//     const sendEmailCommand = createSendEmailCommand(
//         "pashanwinsty1998@gmail.com",
//         "sender@devmatrimony.in",
//     );

//     try {
//         return await sesClient.send(sendEmailCommand);
//     } catch (caught) {
//         if (caught instanceof Error && caught.name === "MessageRejected") {
//             const messageRejectedError = caught;
//             return messageRejectedError;
//         }
//         throw caught;
//     }
// };

// // snippet-end:[ses.JavaScript.email.sendEmailV3]
// module.exports =  { run };