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

async function sendSatisEmail(topCubeLayout, bottomCubeLayout) {
     const taggedData = await tagPivotData(topCubeLayout);
     const taggedBottomData = await tagPivotData(bottomCubeLayout);
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
          bottomcols: [
               "Satış Ekibi / Ürün Ailesi",
               "Bütçe Net Ciro",
               "Fatura Fiili Net Ciro",
               "Gerçekleşme %",
               "Bütçe CM2",
               "Bütçe CM2 Katkı Oran %",
               "CM2",
               "Gerçekleşen CM2 Katkı Oran %",
          ],
          bottomdata: taggedBottomData,
     };

     mailer.sendMail({ to: CONFIG.recipients.satis.to }, "satis", locals, {});
}

const {
     satis: { appId, tableTopObjectId, tableBottomObjectId },
} = CONFIG; // '072ef435-96bb-4760-bfac-3452a0f7b720';

module.exports = {
     get: async (req, res) => {
          try {
               console.log("notify satis");
               const session = await qs.init();
               const app = await session.openDoc(appId, "", "", "", false);

               const fieldGelirTipi = await app.getField("[SALES.Gelir Tipi]");
               await fieldGelirTipi.selectValues([
                    { qText: "Ürün Geliri", isNumeric: false },
               ]);

               const fieldGrup = await app.getField(
                    "[CUSTOMER.Customer Group]"
               );
               await fieldGrup.selectValues([
                    { qText: "Grup Dışı", isNumeric: false },
               ]);

               const thisYear = new Date().getFullYear();
               const fieldYear = await app.getField("[MasterCalendar.Year]");
               await fieldYear.selectValues([
                    { qNumber: 2024, isNumeric: true },
               ]);

               const topTableObject = await app.getObject(tableTopObjectId);
               const bottomTableObject = await app.getObject(
                    tableBottomObjectId
               );

               const topCubeLayout = await topTableObject.getLayout();
               const bottomCubeLayout = await bottomTableObject.getLayout();

               await sendSatisEmail(topCubeLayout, bottomCubeLayout);

               qs.close();

               return res.send(
                    JSON.stringify({
                         result: "success satis v2",
                    })
               );
          } catch (ex) {
               qs.close();
               return res.send(
                    JSON.stringify({
                         result: "error satis v2",
                         message: ex.message,
                    })
               );
          }
     },
};
