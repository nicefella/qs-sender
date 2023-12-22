/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
// const errors = require('restify-errors');
// const nodemailerNTLMAuth = require('nodemailer-ntlm-auth');
const request = require('../../request');

module.exports = {

     upload: async (req, res) => {
          try {
               const { contentLibraryId, fileName } = req.query;
               const fileUrl = await request.uploadFile(contentLibraryId, fileName, req.body);
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
