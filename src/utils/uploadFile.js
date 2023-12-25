const fs = require('fs');
const request = require('../request');

async function uploadFile(customerId, invoiceId) {
     return new Promise(((resolve, reject) => {
          // Read the file as a binary data
          try {
               const filePath = `files/html/${customerId}_${invoiceId}.html`;
               const fileData = fs.readFileSync(filePath);
               const fileName = `${customerId}_${invoiceId}.html`;

               request.uploadFile('invoices', fileName, fileData).then((fileUrl) => {
                    resolve(fileUrl);
               });
          } catch (ex) {
               reject(ex);
          }
     }));
}

module.exports = uploadFile;
