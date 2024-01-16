/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
// const errors = require('restify-errors');
// const nodemailerNTLMAuth = require('nodemailer-ntlm-auth');
const qs = require('../../qs');


module.exports = {
     get: async (req, res) => {
          try {
               const {
                    appId, vName, vId, value
               } = req.query;
               const session = await qs.init();
               const app = await session.openDoc(appId, '', '', '', false);
               //    const variable = await app.getVariableByName(vName);
               const variableById = await app.getVariableById(vId);
               //    const ves = await variable.setStringValue(value);
               const vesById = await variableById.setStringValue(value);

               qs.close();

               return res.send(JSON.stringify({
                    result: 'setsuccess',
                    //    ves: JSON.stringify(ves),
                    vesById: JSON.stringify(vesById),
                    vId,
                    vName,
                    appId,


                    // message: `${bids.length} teklif e-posta olarak gönderildi!`
               }));
          } catch (ex) {
               qs.close();
               return res.send(JSON.stringify({
                    result: 'seterror',
                    message: ex.message
               }));
          }
     }
};
