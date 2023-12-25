const fs = require('fs');
const { parseString } = require('xml2js');

/**
 * Writes a string to an XML file.
 * @param {string} xmlString - The XML string to be written to the file.
 * @param {string} filePath - The path of the file where the XML should be written.
 */
async function writeStringToXMLFile(xmlString, customerId, invoiceId) {
     // Optional: Convert the XML string to a JavaScript object and back to XML for formatting

     return new Promise(((resolve, reject) => {
          parseString(xmlString, (err, result) => {
               if (err) {
                    console.error('Error parsing XML string:', err);
                    return;
               }

               const { Builder } = require('xml2js');
               const builder = new Builder();
               const xml = builder.buildObject(result);

               const filePath = `files/xml/${customerId}_${invoiceId}.xml`;

               // Write to file
               fs.writeFile(filePath, xml, (err) => {
                    if (err) {
                         console.error('Error writing to file:', err);
                         reject(err);
                    }
                    console.log('XML file was written successfully');
                    resolve(true);
               });
          });
     }));
}


module.exports = writeStringToXMLFile;
