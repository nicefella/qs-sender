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

async function sendSatisEmail(
     cubeLayoutUSD,
     cubeLayoutEUR,
     totalCubeLayoutUSD,
     totalCubeLayoutEUR
) {
     const taggedDataUSD = await tagPivotData(cubeLayoutUSD);
     const taggedDataEUR = await tagPivotData(cubeLayoutEUR);
     const totalTaggedDataUSD = await tagPivotData(totalCubeLayoutUSD);
     const totalTaggedDataEUR = await tagPivotData(totalCubeLayoutEUR);

     const locals = {
          guncelleme_tarihi: getFormatedToday(),
          cols: [
               "Marka / Ürün Ailesi",
               "Bütçe Net Ciro",
               "Sipariş Ciro",
               "İrsaliye Ciro",
               "Fatura Fiili Net Ciro",
               "Sip+İrs+Fat Toplam Ciro",
               "Gerçekleşme %",
               "Bütçe CM2",
               "Bütçe CM2 Katkı Oran %",
               "CM2",
               "Gerçekleşen CM2 Katkı Oran %",
          ],
          dataUSD: taggedDataUSD,
          dataEUR: taggedDataEUR,
          totalDataUSD: totalTaggedDataUSD,
          totalDataEUR: totalTaggedDataEUR,
     };

     mailer.sendMail(
          { to: CONFIG.recipients.satis.to, bcc: CONFIG.recipients.satis.bcc },
          "satiscurrency_v2",
          locals,
          {}
     );
}

const {
     satis: { appId, tableTopObjectId, tableBottomObjectId, tableV2ObjectId },
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
                    { qText: "Fiyat Farkı Geliri", isNumeric: false },
               ]);

               const fieldGrup = await app.getField(
                    "[CUSTOMER.Customer Group]"
               );
               await fieldGrup.selectValues([
                    { qText: "Grup Dışı", isNumeric: false },
               ]);

               const fieldBrand = await app.getField("Materyal.BRAND");
               const variableCurrency = await app.getVariableByName(
                    "vSelectedCurrency"
               );
               const thisYear = new Date().getFullYear();
               const fieldYear = await app.getField("[MasterCalendar.Year]");
               await fieldYear.selectValues([
                    { qNumber: thisYear, qIsNumeric: true },
               ]);

               const v2TableObject = await app.getObject(tableV2ObjectId);

               // set the currency variable to 'USD'
               await variableCurrency.setStringValue("USD");
               await fieldBrand.selectValues([
                    { qText: "INKA", isNumeric: false },
               ]);
               const cubeLayoutUSD = await v2TableObject.getLayout();

               // set the currency variable to 'EUR'
               await variableCurrency.setStringValue("EUR");
               await fieldBrand.selectValues([
                    { qText: "ÖZEL MARKA", isNumeric: false },
               ]);
               const cubeLayoutEUR = await v2TableObject.getLayout();

               // clear currency field selections
               await fieldBrand.clear();

               await variableCurrency.setStringValue("EUR");
               const totalCubeLayoutEUR = await v2TableObject.getLayout();

               await variableCurrency.setStringValue("USD");
               const totalCubeLayoutUSD = await v2TableObject.getLayout();

               await sendSatisEmail(
                    cubeLayoutUSD,
                    cubeLayoutEUR,
                    totalCubeLayoutUSD,
                    totalCubeLayoutEUR
               );

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
