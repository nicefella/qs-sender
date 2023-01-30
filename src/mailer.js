const nodemailer = require('nodemailer');
const Email = require('email-templates');
const CONFIG = require('./../config.json');

const {
     host, port, user, pass, to, visibleFrom
} = CONFIG.email;

const transport = nodemailer.createTransport({
     host,
     port,
     secure: false,
     auth: {
          user,
          pass
     },
     tls: {
          rejectUnauthorized: false,
     }
});

const email = new Email({
     message: {
          from: visibleFrom
     },
     send: true,
     preview: false,
     transport,
});

module.exports = {
     sendMail(_, template, locals, { fileName, file }) {
          email
               .send({
                    template,
                    message: {
                         to,
                         attachments: [
                              {
                                   filename: fileName,
                                   content: file
                              }
                         ]
                    },
                    locals
               })
               .then(console.log)
               .catch(console.error);
     }
};
