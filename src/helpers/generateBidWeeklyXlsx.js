/* eslint-disable quotes */
const fs = require("fs");
const XLSX = require("xlsx-js-style");
const generateId = require("./generateId");

module.exports = async function generateBidWeeklyXlsx(items) {
     return new Promise((resolve, reject) => {
          const fileName = `Haftalık Teklif Özeti ${generateId()}.xlsx`;
          const filePath = `./files/${fileName}`;

          console.log("excel oluşturuluyor");

          const wb = XLSX.utils.book_new();

          const headers = [
               {
                    v: "Hafta",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "left" },
                    },
               },
               {
                    v: "Teklif Tarihi",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "left" },
                    },
               },
               {
                    v: "Teklif Tipi",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "left" },
                    },
               },
               {
                    v: "Teklif No",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "left" },
                    },
               },
               {
                    v: "Müşteri No",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "left" },
                    },
               },
               {
                    v: "Müşteri",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "left" },
                    },
               },
               {
                    v: "Proje No",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "left" },
                    },
               },
               {
                    v: "Proje",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "left" },
                    },
               },
               {
                    v: "Proje Fırsat Büyüklüğü",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "left" },
                    },
               },
               {
                    v: "Fırsat Para Birimi",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "left" },
                    },
               },
               {
                    v: "Satış Temsilcisi",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "left" },
                    },
               },
               {
                    v: "Ürün Ailesi",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "left" },
                    },
               },
               {
                    v: "Toplam Tutar",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "right" },
                    },
               },
               {
                    v: "Toplam CM2",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "right" },
                    },
               },
               {
                    v: "Para Birimi",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "right" },
                    },
               },
               {
                    v: "CM2 %",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "right" },
                    },
               },
               {
                    v: "Sipariş Tutarı",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "right" },
                    },
               },
               {
                    v: "Sipariş %",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "right" },
                    },
               },
               {
                    v: "Sipariş No",
                    t: "s",
                    s: {
                         font: { sz: 11, bold: true, color: { rgb: "000000" } },
                         alignment: { horizontal: "left" },
                    },
               },
          ];

          console.log("excel oluşturuluyor: headers");

          // console.log(items);
          const rows = items.map((item) => {
               const row = item.map((col, index) => {
                    let bgColor = "FFFFFF";
                    const alignment =
                         index !== 8 && index < 12 ? "left" : "right";
                    if (col.qAttrExps !== undefined) {
                         bgColor = col.qAttrExps.qValues[0].qText?.substring(1);
                         //   console.log("col", { index, v: col.qText });

                         return {
                              v: col.qText,
                              // v,
                              t: "s",
                              // z,
                              // t: "s",
                              s: {
                                   fill: { fgColor: { rgb: bgColor } },
                                   font: {
                                        sz: 11,
                                        bold: true /* color: { rgb: 'FFFFFF' } */,
                                   },
                                   alignment: { horizontal: alignment },
                              },
                         };
                    }

                    let v = "";
                    let t = "s";
                    let z = "0.00";

                    if (
                         index === 8 ||
                         index === 12 ||
                         index === 13 ||
                         index === 16
                    ) {
                         v = col.qNum;
                         t = "n";
                         z = "#,##0.00";
                         // v = XLSX.SSF.format(col.qNum, "0.00");
                    } else if (index === 15 || index === 17) {
                         v = col.qNum;
                         t = "n";
                         z = "0.00%";
                         // v = XLSX.SSF.format(col.qNum, "0.00%");
                    } else {
                         v = col.qText;
                         z = "0.00";
                    }

                    return {
                         // v: col.qText,
                         // t: "s",
                         v,
                         t,
                         z,
                         s: {
                              font: { sz: 11, color: { rgb: "000000" } },
                              alignment: { horizontal: alignment },
                         },
                    };
               });
               return row;
          });

          console.log("excel oluşturuluyor: rows");

          const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
          XLSX.utils.book_append_sheet(wb, ws, "readme demo");

          console.log("excel oluşturuluyor: append");

          XLSX.writeFile(wb, filePath);

          console.log("excel oluşturuluyor: writefile");

          resolve({
               fileName,
               file: fs.readFileSync(filePath),
          });
     });
};
