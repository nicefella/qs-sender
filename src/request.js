process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
// default for all https requests
// (whether using https directly, request, or another module)

const https = require('https');
const fs = require('fs');
const path = require('path');
const { default: axios } = require('axios');

/* const options = {
     hostname: 'localhost',
     port: 4242,
     path: '/qrs/task/d4041d6d-4bb3-42d3-afd4-67648b6bbf4d/start/synchronous?xrfkey=QW4XPIKvqj1goLux',
     method: 'POST',
     //  key: fs.readFileSync(path.resolve(__dirname, './cert/loc_client_key.pem')),
     //  cert: fs.readFileSync(path.resolve(__dirname, './cert/loc_client.pem')),
     pfx: fs.readFileSync(path.resolve(__dirname, './cert/loc_client.pfx')),
     passphrase: '1',
     agent: false,
     headers: {
          'X-Qlik-Xrfkey': 'QW4XPIKvqj1goLux',
          'X-Qlik-User': 'UserDirectory=INKAFIXING; UserId=QlikSense'
     }
}; */
const agent = new https.Agent({
     //  requestCert: true,
     //  rejectUnauthorized: true,
     key: fs.readFileSync(path.resolve(__dirname, './cert/loc_client_key.pem')),
     //  cert: fs.readFileSync(path.resolve(__dirname, './cert/loc_client.pem')),
     pfx: fs.readFileSync(path.resolve(__dirname, './cert/loc_client.pfx')),
     passphrase: '1',
});

const options = {
     url: 'https://localhost:4242/qrs/task/d4041d6d-4bb3-42d3-afd4-67648b6bbf4d/start/synchronous?xrfkey=QW4XPIKvqj1goLux', // <---this is  a fake ip do not bother
     method: 'POST',
     httpsAgent: agent,
     headers: {
          'X-Qlik-Xrfkey': 'QW4XPIKvqj1goLux',
          'X-Qlik-User': 'UserDirectory=INKAFIXING; UserId=QlikSense'
     },
     data: {}
};


module.exports = {
     start: async () => new Promise((resolve, reject) => {
          try {
               axios(options)
                    .then((response) => {
                         resolve(response.data);
                    }).catch((err) => {
                         console.log(err);
                         reject(err);
                    });

               /*  console.log({ op: options.pfx });
               https.request(options, (res) => {
                    resolve(res);
               });

               const req = https.request(options, (res) => {
                    console.log(`statusCode: ${res.statusCode}`);

                    res.on('data', (d) => {
                         process.stdout.write(d);
                    });
               });

               req.on('error', (error) => {
                    console.error(error);
                    reject(error);
               });

               req.write(JSON.stringify({}));
               req.end(); */
          } catch (ex) {
               console.log(ex.message);
               reject(ex);
          }
     })
};
