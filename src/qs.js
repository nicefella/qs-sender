const enigma = require('enigma.js');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');


const schema = require('enigma.js/schemas/12.20.0.json');

// Your Sense Enterprise installation hostname:
const engineHost = 'qliksense.inkafixing.local';
// const engineHost = '192.168.0.81';
// const engineHost = 'localhost';

// Make sure the port below is accessible from the machine where this example
// is executed. If you changed the QIX Engine port in your installation, change this:
// const enginePort = 80;

// 'engineData' is a special "app id" that indicates you only want to use the global
// QIX interface or session apps, change this to an existing app guid if you intend
// to open that app:
const appId = 'engineData';

// The Sense Enterprise-configured user directory for the user you want to identify
// as:
const userDirectory = 'INKAFIXING';

// The user to use when creating the session:
const userId = 'Qlik1';


const token = {
     userDirectory,
     userId
};

// Path to the private key used for JWT signing:
const privateKeyPath = './keys/privatekey.pem';
const key = fs.readFileSync(path.resolve(__dirname, privateKeyPath));

// Sign the token using the RS256 algorithm:
const signedToken = jwt.sign(token, key, { algorithm: 'RS256' });


// Path to a local folder containing the Sense Enterprise exported certificates:
// const certificatesPath = './cert';

// Helper function to read the contents of the certificate files:
// const readCert = (filename) => fs.readFileSync(path.resolve(__dirname,
// certificatesPath, filename));


const QIX = {
     session: null,
     signedToken,
     init: async () => {
          QIX.session = enigma.create({
               schema,
               url: `ws://${engineHost}/jwt/app/${appId}/identity/qsServiceIdentity`,
               // Notice the non-standard second parameter here, this is how you pass in
               // additional configuration to the 'ws' npm library, if you use a different
               // library you may configure this differently:
               createSocket: url => new WebSocket(url, {
                    headers: { Authorization: `Bearer ${signedToken}` },
                    //   ca: [readCert('root.pem')],
                    //   key: readCert('client_key.pem'),
                    //   cert: readCert('client.pem'),
                    rejectUnauthorized: false,
                    //   headers: {
                    //     'X-Qlik-User': `UserDirectory=${encodeURIComponent(userDirectory)};
                    // UserId=${encodeURIComponent(userId)}`,
                    //   },
               }),
          });

          //    session.on('traffic:*', (direction, msg) => console.log(direction, msg));
          QIX.session.on('error', (err) => {
               console.log(err);
          });

          try {
               const global = await QIX.session.open();
               return global;
          } catch (error) {
               console.log('Failed to open session and/or retrieve the app list:', error);
               return error.message;
          }
     },

     close: () => {
          if (QIX.session !== null || QIX.session !== undefined) QIX.session.close();
     }
};

module.exports = QIX;
