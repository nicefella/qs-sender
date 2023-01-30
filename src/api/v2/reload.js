/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
// const errors = require('restify-errors');
const http = require('http');
const path = require('path');
const mailer = require('../../mailer');
// const nodemailerNTLMAuth = require('nodemailer-ntlm-auth');
const qs = require('../../qs');
const { signedToken } = require('../../qs');

module.exports = {
     post: async (req, res) =>
          res.send(JSON.stringify({
               result: 'success',
               message: 'Greetings from INKA QS Service!'
          })),

     get: async (req, res) => {
          try {
               const { appId } = req.query;

               const session = await qs.init();
               const app = await session.openDoc(appId, '', '', '', false);
               const reload = await app.doReload();

               return res.send(JSON.stringify({
                    result: 'success v2',
               }));
          } catch (ex) {
               return res.send(JSON.stringify({
                    result: 'error v2',
                    message: ex.message
               }));
          }
     }
};
