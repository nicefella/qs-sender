/* eslint-disable quotes */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
// const errors = require('restify-errors');

const mailer = require("../../mailer");
// const nodemailerNTLMAuth = require('nodemailer-ntlm-auth');
const qs = require("../../qs");

const CONFIG = require("./../../../config.json");
const getFormatedToday = require("../../helpers/getFormatedToday");
const tagPivotData = require("../../helpers/tagPivotData");

async function sendSatisEmail(topCubeLayout) {
     const taggedData = await tagPivotData(topCubeLayout);
     console.log({ topCubeLayout, taggedData });
     const locals = {
          guncelleme_tarihi: getFormatedToday(),
          cols: [
               "Satış Ekibi / Ürün Ailesi",
               "Bütçe Net Ciro",
               "Sipariş Ciro",
               "İrsaliye Ciro",
               "Fatura Fiili Net Ciro",
               "Sip+İrs+Fat Toplam Ciro",
          ],
          data: taggedData,
     };

     mailer.sendMail({ to: CONFIG.recipients.satis.to }, "satis", locals, {});
}

const {
     satis: { appId, tableTopObjectId, tableBottomObjectId },
} = CONFIG; // '072ef435-96bb-4760-bfac-3452a0f7b720';

module.exports = {
     get: async (req, res) => {
          try {
               console.log("notifyweekly");
               const session = await qs.init();
               const app = await session.openDoc(appId, "", "", "", false);
               const topTableObject = await app.getObject(tableTopObjectId);
               // const bottomTableObject = await app.getObject(
               //      tableBottomObjectId
               // );

               const topCubeLayout = await topTableObject.getLayout();

               await sendSatisEmail(topCubeLayout);

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
