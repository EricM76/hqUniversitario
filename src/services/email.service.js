const process = require("process");
var SibApiV3Sdk = require("sib-api-v3-sdk");
SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
  process.env.API_KEY;

const sendEmail = ({subject, title, content, to, params,templateId}) => {
    // subject
    // title
    // content
    // to
  new SibApiV3Sdk.TransactionalEmailsApi()
    .sendTransacEmail({
      sender: { email: "hq.universitario@gmail.com", name: "HQ Universitario" },
      subject: subject,
      to, 
      params,
      templateId,
    /*   htmlContent:
        "<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>", */
     /*  messageVersions: [
        //Definition for Message Version 1
        {
          to: to,
          htmlContent:
            `<!DOCTYPE html><html><body><h1>${title}</h1><p>${content}</p></body></html>`, 
          subject: subject,
          params,
          templateId,
    
        },

        // Definition for Message Version 2
        {
          to: [
            {
              email: "jim@example.com",
              name: "Jim Stevens",
            },
            {
              email: "mark@example.com",
              name: "Mark Payton",
            },
            {
              email: "andrea@example.com",
              name: "Andrea Wallace",
            },
          ],
        },
      ], */
    })
    .then(
      function (data) {
        console.log(data);
      },
      function (error) {
        console.error(error);
      }
    );
};

module.exports = sendEmail;
