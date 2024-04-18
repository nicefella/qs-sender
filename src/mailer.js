/* eslint-disable quotes */
const nodemailer = require("nodemailer");
const Email = require("email-templates");
const CONFIG = require("./../config.json");

const {
     host,
     port,
     user,
     pass,
     // to,
     visibleFrom,
} = CONFIG.email;

const transport = nodemailer.createTransport({
     host,
     port,
     secure: false,
     auth: {
          user,
          pass,
     },
     tls: {
          rejectUnauthorized: false,
     },
});

const email = new Email({
     message: {
          from: visibleFrom,
     },
     send: true,
     preview: true,
     transport,
});

module.exports = {
     sendMail(to, template, locals, { fileName, file } = {}) {
          const options = {
               template,
               message: {
                    to,
                    // eslint-disable-next-line quotes
                    // bcc: "info@noblapps.io",
               },
               locals,
          };

          if (fileName !== undefined) {
               options.message.attachments = [
                    {
                         filename: fileName,
                         content: file,
                    },
               ];
          }

          email.send(options).then(console.log).catch(console.error);
     },
};
