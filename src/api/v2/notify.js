/* eslint-disable quotes */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
// const errors = require('restify-errors');
const nodemailer = require("nodemailer");
const http = require("http");
const fs = require("fs");
const xlsx = require("node-xlsx");
const path = require("path");
const mailer = require("../../mailer");
// const nodemailerNTLMAuth = require('nodemailer-ntlm-auth');
const qs = require("../../qs");
const { signedToken } = require("../../qs");
const generateId = require("../../helpers/generateId");
const generateXlsx = require("../../helpers/generateXlsx");
const CONFIG = require("./../../../config.json");

async function downloadFile(fileUrl) {
     return new Promise((resolve, reject) => {
          try {
               const options = {
                    hostname: "qliksense.inkafixing.local",
                    path: `/jwt${fileUrl}`,
                    headers: {
                         Authorization: `Bearer ${signedToken}`,
                    },
               };
               const request = http.get(options, (res) => {
                    //   const file = path.resolve(outputDir + '/foo.xlsx');
                    const fileName = `Teklif ${generateId()}.xlsx`;
                    const filePath = `./files/${fileName}`;
                    console.log("=====filepath oluşturuldu");
                    const fileStream = fs.createWriteStream(filePath);
                    console.log("=====filestream oluşturuldu");

                    res.pipe(fileStream);
                    console.log("=====filestream pipelandı");

                    fileStream.on("error", (err) => {
                         console.log("Error writing to the stream.");
                         console.log(err);
                    });

                    fileStream.on("close", () => {
                         resolve({
                              fileName,
                              file: fs.readFileSync(filePath),
                         });
                    });

                    fileStream.on("finish", () => {
                         fileStream.close();
                    });
               });
          } catch (ex) {
               reject(ex);
          }
     });
}

function bidEmailerFunctionFactory({ bidField, detailTableObject }) {
     return async function sendBidEmail(bid) {
          const [
               teklifNo,
               tarih,
               toplamUrunAdet,
               esikAltiUrunAdet,
               placer,
               currency,
               firma,

               ,
               ,
               alttoplam,
               kdv,
               geneltoplam,
               costVersion,
               vade,
               urunAilesi,
               esikAltiUrunAdetYeni,
               maliyetiOlmayanUrunAdet,
               maliyetiolmayanalttoplam,
               sirket,
          ] = bid;
          console.log(`${teklifNo.qText} alınıyor`);
          await bidField.selectValues([
               { qText: teklifNo.qText, isNumeric: false },
          ]);
          console.log(`${teklifNo.qText} seçim uygulandı.`);
          //   const fileResponse = await detailTableObject.exportData({ qFileType: 'OOXML', qPath: '/qHyperCubeDef' });
          console.log(`${teklifNo.qText} dosya export alındı.`);

          const detailCubeData = await detailTableObject.getHyperCubeData(
               "/qHyperCubeDef",
               [
                    {
                         qLeft: 0,
                         qTop: 0,
                         qWidth: 34,
                         qHeight: 100,
                    },
               ]
          );
          const [{ qMatrix: items }] = detailCubeData;

          const {
               qHyperCube: { qGrandTotalRow: totals },
          } = await detailTableObject.getLayout();

          console.log(
               `${teklifNo.qText} detay hypercube alındı. ${totals.length} satır`
          );

          console.log(
               `${teklifNo.qText} detay hypercube alındı. ${JSON.stringify(
                    totals
               )}`
          );

          const { fileName, file } = await generateXlsx(items, totals);

          const cm1 = totals[10].qText;
          const cm1Yeni = totals[22].qText;
          // const { fileName, file } = await downloadFile(fileResponse.qUrl);
          console.log(`${teklifNo.qText} dosya indirildi.`);
          const locals = {
               sirket: sirket.qText,
               teklifNo: teklifNo.qText,
               tarih: tarih.qText,
               placer: placer.qText,
               firma: firma.qText,
               currency: currency.qText,
               vade: vade.qText,
               costVersion: costVersion.qText,
               alttoplam: alttoplam.qText,
               kdv: kdv.qText,
               geneltoplam: geneltoplam.qText,
               toplamUrunAdet: toplamUrunAdet.qText,
               esikAltiUrunAdet: esikAltiUrunAdet.qText,
               urunAilesi: urunAilesi.qText,
               cm1,
               cm1Yeni,
               maliyetiolmayanalttoplam: maliyetiolmayanalttoplam.qText,
               maliyetiOlmayanUrunAdet: maliyetiOlmayanUrunAdet.qText,
               esikAltiUrunAdetYeni: esikAltiUrunAdetYeni.qText,
               to: "ismail@noblapps.io",
          };

          console.log(`${teklifNo.qText} dosya adı oluşturuldu.`);

          mailer.sendMail(
               { to: CONFIG.recipients.teklif.to },
               "bidsent",
               locals,
               { fileName, file }
          );
          console.log(`${teklifNo.qText} seçim temizlendi.`);
          await bidField.clear();
          console.log(`${teklifNo.qText} e-posta gönderildi.`);
     };
}

const { appId, baseTableObjectId, detailTableObjectId, bidFieldName } = CONFIG; // '072ef435-96bb-4760-bfac-3452a0f7b720';
// const baseTableObjectId = 'vJUSvs';
// const detailTableObjectId = 'TzQps';
// const bidFieldName = '[Teklif No]';

module.exports = {
     post: async (req, res) =>
          //   sendMail().catch(console.error);
          res.send(
               JSON.stringify({
                    result: "success",
                    message: "Greetings from INKA QS Service!",
               })
          ),
     // return next(new errors.NotAuthorizedError());

     get: async (req, res) => {
          try {
               //   const { file, fileName } = await generateXlsx();
               // const { file, fileName } = await downloadFile('/content/static/5e18a23b-e4ba-4ffa-8c85-e1e0facce073.xlsx');
               //  mailer.sendMail('ismail@noblapps.io', 'bidsent', {}, { file, fileName });
               //     console.log('FILE===', file);
               //  sendMail().catch(console.error);
               console.log("notify");
               const session = await qs.init();
               const app = await session.openDoc(appId, "", "", "", false);
               const baseTableObject = await app.getObject(baseTableObjectId);
               const detailTableObject = await app.getObject(
                    detailTableObjectId
               );
               const bidField = await app.getField(bidFieldName);
               const sendBidEmail = bidEmailerFunctionFactory({
                    bidField,
                    detailTableObject,
               });
               const cubeData = await baseTableObject.getHyperCubeData(
                    "/qHyperCubeDef",
                    [
                         {
                              qLeft: 0,
                              qTop: 0,
                              qWidth: 19,
                              qHeight: 5,
                         },
                    ]
               );
               const [{ qMatrix: bids }] = cubeData;

               await bids.reduce(
                    (previousPromise, bid) =>
                         previousPromise.then(() => sendBidEmail(bid)),
                    Promise.resolve()
               );

               qs.close();

               return res.send(
                    JSON.stringify({
                         result: "success v2",
                         // message: `${bids.length} teklif e-posta olarak gönderildi!`
                    })
               );
          } catch (ex) {
               qs.close();
               return res.send(
                    JSON.stringify({
                         result: "error v2",
                         message: ex.message,
                    })
               );
          }

          // return next(new errors.NotAuthorizedError());
     },
};
