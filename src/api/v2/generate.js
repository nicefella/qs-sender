/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
// const errors = require('restify-errors');
// const nodemailerNTLMAuth = require('nodemailer-ntlm-auth');
const pdf = require('../../pdf');

module.exports = {

     generate: async (req, res) => {
          try {
               const { customerId, invoiceId } = req.query;
               const fileUrl = await pdf.generate(customerId, invoiceId);
               return res.send(JSON.stringify({
                    result: 'success',
                    fileUrl
               }));
          } catch (ex) {
               return res.send(JSON.stringify({
                    result: 'error upload',
                    message: ex.message
               }));
          }
     }
};
