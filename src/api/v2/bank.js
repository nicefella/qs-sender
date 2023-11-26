/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
// const errors = require('restify-errors');
const mailer = require('../../mailer');
// const nodemailerNTLMAuth = require('nodemailer-ntlm-auth');

module.exports = {
     get: async (req, res) => {
          try {
               mailer.sendMail('ismail@noblapps.io', 'bankadurum', {});
               return res.send(JSON.stringify({
                    result: 'success v2',
                    // message: `${bids.length} teklif e-posta olarak gönderildi!`
               }));
          } catch (ex) {
               return res.send(JSON.stringify({
                    result: 'error v2',
                    message: ex.message
               }));
          }

          // return next(new errors.NotAuthorizedError());
     }
};
