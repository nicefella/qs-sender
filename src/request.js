process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
// default for all https requests
// (whether using https directly, request, or another module)

const https = require('https');
const fs = require('fs');
const path = require('path');
const CONFIG = require('./../config.json');

const { host } = CONFIG;
const options = {
     hostname: host,
     port: 4242,
     path: '/qrs/task/d4041d6d-4bb3-42d3-afd4-67648b6bbf4d/start/synchronous?xrfkey=QW4XPIKvqj1goLux',
     method: 'POST',
     key: fs.readFileSync(path.resolve(__dirname, './cert/if2_client_key.pem')),
     cert: fs.readFileSync(path.resolve(__dirname, './cert/if2_client.pem')),
     agent: false,
     headers: {
          'X-Qlik-Xrfkey': 'QW4XPIKvqj1goLux',
          'X-Qlik-User': 'UserDirectory=INKAFIXING; UserId=QlikSense'
     }
};

module.exports = {
     start: async () => new Promise((resolve, reject) => {
          try {
               console.log({ op: options.cert });
               https.request(options, (res) => {
                    resolve(res);
               });
          } catch (ex) {
               console.log(ex.message);
               reject(ex);
          }
     })
};
