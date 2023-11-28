/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
// const errors = require('restify-errors');
const mailer = require('../../mailer');
// const nodemailerNTLMAuth = require('nodemailer-ntlm-auth');
const qs = require('../../qs');
const CONFIG = require('./../../../config.json');


const COLOR_POSITIVE = '#49a127';
const COLOR_NEGATIVE = '#bf3032';


const BANK_CONFIG = {
     appId: '318d27a9-8743-47aa-9725-6efda1f9b21e',

     kpi_bankadaki_para: 'yJPQeRV',
     kpi_baglanan_para: 'ESNpYgm',
     kpi_blokeli_para: 'LkepK',
     kpi_toplam_para: 'AUpEj',

     kpi_gecmis_fkv: '2933e879-255a-487d-924b-fec74f32cc48',
     kpi_kalan_fkv: 'c244c4a9-4021-4a08-be3d-78748984da8c',
     kpi_toplam_fkv: 'aa1763f8-1615-4fb5-9240-6e49466da6da',
     kpi_gecmis_fg: 'd9ac3297-8c0d-4fe7-b90d-b61504d5c70d',
     kpi_kalan_fg: 'aad39582-4f99-4d80-9440-fd6af4f2b274',
     kpi_toplam_fg: 'bcf74869-3107-497e-9979-fa4846e55f42',
     kpi_gecmis_fark: '17f6c863-8226-4814-9b8d-f353502cbfe1',
     kpi_kalan_fark: 'bdc09ec3-c328-46bf-b614-93f46cc76cc9',
     kpi_toplam_fark: 'ca2337f1-4ef2-4e8a-a272-e233b62475ab',

     tavsiye_cizelge_table: 'cc22021e-4a0b-474e-9150-dba9822fd0cc',
     subeTable: 'BuxMPFy',
};


function getFormatedToday() {
     const today = new Date();
     const yyyy = today.getFullYear();
     let MM = today.getMonth() + 1; // Months start at 0!
     let dd = today.getDate();

     let hh = today.getHours();
     let mm = today.getMinutes();

     if (dd < 10) dd = `0${dd}`;
     if (MM < 10) MM = `0${MM}`;
     if (hh < 10) hh = `0${hh}`;
     if (mm < 10) mm = `0${mm}`;

     return `${dd}.${MM}.${yyyy} ${hh}:${mm}`;
}

async function getKpiData({ app, objectId, useColoring = false }) {
     const object = await app.getObject(objectId);
     const cube = await object.getHyperCubeData('/qHyperCubeDef', [
          {
               qLeft: 0,
               qTop: 0,
               qWidth: 1,
               qHeight: 1
          },
     ]);
     const [{ qMatrix: matrix = [] } = {}] = cube || [];

     const colorStyle = matrix[0][0].qNum >= 0
          ? { color: COLOR_POSITIVE } : { color: COLOR_NEGATIVE };
     return {
          style: useColoring ? colorStyle : {},
          value: matrix[0][0].qText
     };
}

async function getTableData({
     app, objectId, width = 20, height = 100
}) {
     const object = await app.getObject(objectId);
     const layout = await object.getLayout();
     const subeTableData = await object.getHyperCubeData('/qHyperCubeDef', [
          {
               qLeft: 0,
               qTop: 0,
               qWidth: width,
               qHeight: height
          },
     ]);
     const [{ qMatrix: data = [] } = {}] = subeTableData || [];
     const { qHyperCube: { qGrandTotalRow: subTotals = [] } = {} } = layout;


     return { data, subTotals };
}


module.exports = {
     get: async (req, res) => {
          try {
               const session = await qs.init();
               const app = await session.openDoc(BANK_CONFIG.appId, '', '', '', false);
               const table1Object = await app.getObject(BANK_CONFIG.tavsiye_cizelge_table);
               const cubeData1 = await table1Object.getHyperCubeData('/qHyperCubeDef', [
                    {
                         qLeft: 0,
                         qTop: 0,
                         qWidth: 18,
                         qHeight: 100
                    },
               ]);
               const [{ qMatrix: faizOranlariVeMevduatlarData = [] } = {}] = cubeData1 || [];

               const { data: subeData, subTotals: subeSubTotals } = await getTableData({
                    app, objectId: BANK_CONFIG.subeTable
               });

               const { value: kpi_baglanan_para, style: kpi_baglanan_para_style } = await getKpiData({
                    app, objectId: BANK_CONFIG.kpi_baglanan_para, useColoring: false
               });

               const { value: kpi_bankadaki_para, style: kpi_bankadaki_para_style } = await getKpiData({
                    app, objectId: BANK_CONFIG.kpi_bankadaki_para, useColoring: false
               });

               const { value: kpi_blokeli_para, style: kpi_blokeli_para_style } = await getKpiData({
                    app, objectId: BANK_CONFIG.kpi_blokeli_para, useColoring: false
               });

               const { value: kpi_toplam_para, style: kpi_toplam_para_style } = await getKpiData({
                    app, objectId: BANK_CONFIG.kpi_toplam_para, useColoring: false
               });


               const { value: kpi_gecmis_fkv, style: kpi_gecmis_fkv_style } = await getKpiData({
                    app, objectId: BANK_CONFIG.kpi_gecmis_fkv, useColoring: false
               });

               const { value: kpi_kalan_fkv, style: kpi_kalan_fkv_style } = await getKpiData({
                    app, objectId: BANK_CONFIG.kpi_kalan_fkv, useColoring: false
               });

               const { value: kpi_toplam_fkv, style: kpi_toplam_fkv_style } = await getKpiData({
                    app, objectId: BANK_CONFIG.kpi_toplam_fkv, useColoring: false
               });


               const { value: kpi_gecmis_fg, style: kpi_gecmis_fg_style } = await getKpiData({
                    app, objectId: BANK_CONFIG.kpi_gecmis_fg, useColoring: true
               });

               const { value: kpi_kalan_fg, style: kpi_kalan_fg_style } = await getKpiData({
                    app, objectId: BANK_CONFIG.kpi_kalan_fg, useColoring: true
               });

               const { value: kpi_toplam_fg, style: kpi_toplam_fg_style } = await getKpiData({
                    app, objectId: BANK_CONFIG.kpi_toplam_fg, useColoring: true
               });


               const { value: kpi_gecmis_fark, style: kpi_gecmis_fark_style } = await getKpiData({
                    app, objectId: BANK_CONFIG.kpi_gecmis_fark, useColoring: true
               });

               const { value: kpi_kalan_fark, style: kpi_kalan_fark_style } = await getKpiData({
                    app, objectId: BANK_CONFIG.kpi_kalan_fark, useColoring: true
               });

               const { value: kpi_toplam_fark, style: kpi_toplam_fark_style } = await getKpiData({
                    app, objectId: BANK_CONFIG.kpi_toplam_fark, useColoring: true
               });


               mailer.sendMail(CONFIG.recipients.banka.to, 'bankadurum', {
                    guncelleme_tarihi: getFormatedToday(),
                    faizOranlariVeMevduatlarData,
                    subeData,
                    subeSubTotals,

                    kpi_bankadaki_para,
                    kpi_bankadaki_para_style,
                    kpi_baglanan_para,
                    kpi_baglanan_para_style,
                    kpi_blokeli_para,
                    kpi_blokeli_para_style,
                    kpi_toplam_para,
                    kpi_toplam_para_style,

                    kpi_gecmis_fkv,
                    kpi_gecmis_fkv_style,
                    kpi_kalan_fkv,
                    kpi_kalan_fkv_style,
                    kpi_toplam_fkv,
                    kpi_toplam_fkv_style,

                    kpi_gecmis_fg,
                    kpi_gecmis_fg_style,
                    kpi_kalan_fg,
                    kpi_kalan_fg_style,
                    kpi_toplam_fg,
                    kpi_toplam_fg_style,

                    kpi_gecmis_fark,
                    kpi_gecmis_fark_style,
                    kpi_kalan_fark,
                    kpi_kalan_fark_style,
                    kpi_toplam_fark,
                    kpi_toplam_fark_style,

               });

               return res.send(JSON.stringify({
                    result: 'banksuccess',
                    // message: `${bids.length} teklif e-posta olarak gönderildi!`
               }));
          } catch (ex) {
               return res.send(JSON.stringify({
                    result: 'bankerror',
                    message: ex.message
               }));
          }

          // return next(new errors.NotAuthorizedError());
     }
};
