const fs = require('fs');
const request = require('../request');

async function uploadFile(invoiceId) {
     return new Promise(((resolve, reject) => {
          // Read the file as a binary data
          try {
               const filePath = `files/html/${invoiceId}.html`;
               const fileData = fs.readFileSync(filePath);
               const fileName = `${invoiceId}.html`;

               request.uploadFile('invoices', fileName, fileData).then((fileUrl) => {
                    resolve(fileUrl);
               });
          } catch (ex) {
               reject(ex);
          }
     }));
}

module.exports = uploadFile;
