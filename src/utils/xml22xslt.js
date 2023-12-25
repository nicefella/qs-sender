/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const { parseString } = require('xml2js');

/**
 * Extracts text from a specified nested tag in an XML file and writes it to a text file.
 * @param {string} xmlFilePath - Path to the XML file.
 * @param {string} outputFilePath - Path to the output text file.
 */
async function extractTextAndWriteToFile(customerId, invoiceId) {
     return new Promise(((resolve, reject) => {
          const xmlFilePath = `files/xml/${customerId}_${invoiceId}.xml`;
          const outputFilePath = `files/xslt/${customerId}_${invoiceId}.xslt`;

          fs.readFile(xmlFilePath, 'utf8', (err, data) => {
               if (err) {
                    console.error('Error reading XML file:', err);
                    return;
               }

               parseString(data, (err, result) => {
                    if (err) {
                         console.error('Error parsing XML:', err);
                         return;
                    }

                    // Navigating to the specific tag
                    let textToWrite = '';
                    const documentReferences = result.Invoice['cac:AdditionalDocumentReference'];
                    console.log('documentReferences', documentReferences);
                    if (documentReferences) {
                         for (const docRef of documentReferences) {
                              if (docRef['cac:Attachment']) {
                                   const attachment = docRef['cac:Attachment'][0];
                                   if (attachment['cbc:EmbeddedDocumentBinaryObject']) {
                                        textToWrite = attachment['cbc:EmbeddedDocumentBinaryObject'][0]._;
                                        break; // Assuming you only need the first occurrence
                                   }
                              }
                         }
                    }

                    if (!textToWrite) {
                         console.error('Specified text not found in XML');
                         return;
                    }

                    // Decode Base64 text
                    let decodedText = Buffer.from(textToWrite, 'base64').toString('utf8');

                    decodedText = decodedText.replace(/<\/body>\s*<\/html>\s*<html>\s*<head><\/head>\s*<body>/g, '');


                    // Write to output file
                    fs.writeFile(outputFilePath, decodedText, (err) => {
                         if (err) {
                              console.error('Error writing to output file:', err);
                              reject(err);
                         }
                         console.log('Text was extracted and written to file successfully');
                         resolve(true);
                    });
               });
          });
     }));
}


module.exports = extractTextAndWriteToFile;
