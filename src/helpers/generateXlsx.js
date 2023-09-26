const fs = require('fs');
const XLSX = require('xlsx-js-style');
const generateId = require('./generateId');

module.exports = async function generateXlsx(items, totals) {
     return new Promise((resolve, reject) => {
          const fileName = `Teklif ${generateId()}.xlsx`;
          const filePath = `./files/${fileName}`;

          console.log('excel oluşturuluyor');

          const wb = XLSX.utils.book_new();

          const headers = [
               { v: 'Teklif No', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'left' } } },
               { v: 'Sıra No', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'left' } } },
               { v: 'Materyal No', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'left' } } },
               { v: 'Materyal', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'left' } } },
               { v: 'Miktar ', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'Birim', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'Birim Fiyat', t: 's', s: { sz: 11, font: { bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'Tutar', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'İndirim', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'İndirim %', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'Alt Toplam', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'KDV', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'Genel Toplam', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'CM1', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'CM1 %', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'CM1 Eşik', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'CM2', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'CM2 %', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'CM3', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'CM3 %', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: ' ', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'CM1 Maliyet TL', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'CM2 Maliyet TL', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'CM3 Maliyet TL', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },

               { v: 'Yeni Alt Toplam', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'Yeni CM1', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'Yeni CM1 %', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'Yeni CM2', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'Yeni CM2 %', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'Yeni CM3', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
               { v: 'Yeni CM3 %', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },

               { v: 'Ürün Ailesi', t: 's', s: { font: { sz: 11, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'right' } } },
          ];

          console.log('excel oluşturuluyor: headers');

          const subTotals = ['', '', '', {
               v: 'ALT TOPLAM',
               t: 's',
               s: {
                    font: { bold: true, sz: 11, color: { rgb: '000000' } },
                    alignment: { horizontal: 'right' }
               }
          }, ...totals.map(col => ({
               v: col.qText,
               t: 's',
               s: {
                    font: { bold: true, sz: 11, color: { rgb: '000000' } },
                    alignment: { horizontal: 'right' }
               }
          }))];


          console.log('excel oluşturuluyor: subtotals');

          // console.log(items);
          const rows = items.map((item) => {
               const row = item.map((col, index) => {
                    let bgColor = 'FFFFFF';
                    const alignment = index < 4 ? 'left' : 'right';
                    if (col.qAttrExps !== undefined) {
                         bgColor = col.qAttrExps.qValues[0].qText?.substring(1);
                         //   console.log('color', { bgColor, col: col.qAttrExps.qValues[0] });
                         return {
                              v: col.qText,
                              t: 's',
                              s: {
                                   fill: { fgColor: { rgb: bgColor } },
                                   font: { sz: 11, bold: true, /* color: { rgb: 'FFFFFF' } */ },
                                   alignment: { horizontal: alignment }
                              }
                         };
                    }

                    return {
                         v: col.qText,
                         t: 's',
                         s: {
                              font: { sz: 11, color: { rgb: '000000' } },
                              alignment: { horizontal: alignment }
                         }
                    };
               });
               return row;
          });

          console.log('excel oluşturuluyor: rows');

          const ws = XLSX.utils.aoa_to_sheet([headers, ...rows, subTotals]);
          XLSX.utils.book_append_sheet(wb, ws, 'readme demo');

          console.log('excel oluşturuluyor: append');

          XLSX.writeFile(wb, filePath);

          console.log('excel oluşturuluyor: writefile');

          resolve({
               fileName,
               file: fs.readFileSync(filePath)
          });
     });
};
