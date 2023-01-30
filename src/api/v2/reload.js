/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
// const errors = require('restify-errors');
// const nodemailerNTLMAuth = require('nodemailer-ntlm-auth');
const qs = require('../../qs');
const request = require('../../request');

module.exports = {
     post: async (req, res) => res.send(JSON.stringify({
          result: 'success',
          message: 'Greetings from INKA QS Service!'
     })),

     start: async (req, res) => {
          try {
               const resid = await request.start();
               return res.send(JSON.stringify({
                    result: 'success',
                    message: resid
               }));
          } catch (ex) {
               return res.send(JSON.stringify({
                    result: 'error v2',
                    message: ex.message
               }));
          }
     },

     get: async (req, res) => {
          try {
               const { appId } = req.query;

               const session = await qs.init();
               const app = await session.openDoc(appId, '', '', '', false);
               const reload = await app.doReload();
               const save = await app.doSave();

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
