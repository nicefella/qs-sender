/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
// const errors = require('restify-errors');
// const nodemailerNTLMAuth = require('nodemailer-ntlm-auth');
const excel = require('../../excel');
const { makeAnErkekDate } = require('../../helpers/date');
const CONFIG = require('./../../../config.json');

const { filePath } = CONFIG.cashflow; // '/Users/ismail/Documents/INKA/cash.xlsx';

module.exports = {
     append: async (req, res) => {
          try {
               const {
                    Tarih, CikisPB, GirisPB, Tutar
               } = req.body;
               const TutarAsNumber = parseFloat(Tutar).toFixed(2) * 1;
               const date = makeAnErkekDate(Tarih);
               const done = excel.appendRow(filePath, {
                    Tarih, CikisPB, GirisPB, Tutar: TutarAsNumber
               });
               return res.send(JSON.stringify({
                    result: 'success',
                    done,
                    date
               }));
          } catch (ex) {
               return res.send(JSON.stringify({
                    result: 'error cashflow',
                    message: ex.message
               }));
          }
     },
     delete: async (req, res) => {
          try {
               const {
                    Tarih, CikisPB, GirisPB, Tutar
               } = req.body;
               const date = makeAnErkekDate(Tarih);
               const done = excel.deleteRow(filePath, {
                    Tarih, CikisPB, GirisPB, Tutar
               });
               return res.send(JSON.stringify({
                    result: 'success',
                    done,
                    date
               }));
          } catch (ex) {
               return res.send(JSON.stringify({
                    result: 'error cashflow',
                    message: ex.message
               }));
          }
     }
};
