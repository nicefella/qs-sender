/* eslint-disable no-await-in-loop */
/* eslint-disable quotes */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
// const errors = require('restify-errors');

const mailer = require("../../mailer");
// const nodemailerNTLMAuth = require('nodemailer-ntlm-auth');
const qs = require("../../qs");
const generateBidWeeklyXlsx = require("../../helpers/generateBidWeeklyXlsx");
const CONFIG = require("./../../../config.json");
const getFormatedToday = require("../../helpers/getFormatedToday");

async function sendHaftalikTeklifEmail(items) {
     const { fileName, file } = await generateBidWeeklyXlsx(items);

     const locals = {
          guncelleme_tarihi: getFormatedToday(),
     };

     mailer.sendMail(
          {
               to: CONFIG.recipients.teklifhaftalik.to,
               bcc: CONFIG.recipients.teklifhaftalik.bcc,
          },
          "bidweeklysent",
          locals,
          {
               fileName,
               file,
          }
     );
}

const {
     appId,
     teklifhaftalik: { tableObjectId },
} = CONFIG; // '072ef435-96bb-4760-bfac-3452a0f7b720';

module.exports = {
     get: async (req, res) => {
          try {
               console.log("notifyweekly");
               const session = await qs.init();
               const app = await session.openDoc(appId, "", "", "", false);
               const baseTableObject = await app.getObject(tableObjectId);

               const objectLayout = await baseTableObject.getLayout();

               const rowCount = objectLayout.qHyperCube.qSize.qcy;
               const pageSize = 500;
               const pages = Math.ceil(rowCount / pageSize);
               let data = [];

               // eslint-disable-next-line no-plusplus
               for (let page = 0; page < pages; page++) {
                    const cubeData = await baseTableObject.getHyperCubeData(
                         "/qHyperCubeDef",
                         [
                              {
                                   qLeft: 0,
                                   qTop: page * pageSize,
                                   qWidth: 19,
                                   qHeight: pageSize,
                              },
                         ]
                    );
                    const [{ qMatrix }] = cubeData;
                    data = data.concat(qMatrix);
               }

               await sendHaftalikTeklifEmail(data);

               qs.close();

               return res.send(
                    JSON.stringify({
                         result: "success bidweekly v2",
                    })
               );
          } catch (ex) {
               qs.close();
               return res.send(
                    JSON.stringify({
                         result: "error bidweekly v2",
                         message: ex.message,
                    })
               );
          }
     },
};
