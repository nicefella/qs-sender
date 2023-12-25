const { runSqlServerQuery } = require('./db/db');
const transformXmlToHtml = require('./utils/transformXmlToHtml');
const writeStringToXMLFile = require('./utils/text2xml');
const uploadFile = require('./utils/uploadFile');
const extractTextAndWriteToFile = require('./utils/xml22xslt');

async function generate(customerId, invoiceId) {
     try {
          const data = await runSqlServerQuery(`SELECT * FROM INKAERP802.dbo.IASEDIEINVOMSGQ where CUSTOMER='${customerId}' and EINVONUMBER = '${invoiceId}'`); // and EINVONUMBER = 'KAF2023000000849'

          if (data.length === 0) return null;

          const [invoiceNode] = data;

          await writeStringToXMLFile(invoiceNode.EDISTR, customerId, invoiceId);

          await extractTextAndWriteToFile(customerId, invoiceId);

          await transformXmlToHtml(customerId, invoiceId);

          const fileUrl = await uploadFile(invoiceId);

          return fileUrl;
     } catch (ex) {
          throw new Error(ex);
     }
}

module.exports = {
     generate
};
