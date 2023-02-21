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

const baseOptions = {
     method: 'POST',
     httpsAgent: agent,
     headers: {
          'X-Qlik-Xrfkey': 'QW4XPIKvqj1goLux',
          'X-Qlik-User': 'UserDirectory=INKAFIXING; UserId=QlikSense'
     },
     data: {}
};


function getStartTaskOptions(taskId) {
     const url = ['https://localhost:4242/qrs/task/', taskId, '/start/synchronous?xrfkey=QW4XPIKvqj1goLux'].join('');
     return {
          ...baseOptions,
          url,
     };
}

function getAllTasksOptions() {
     const url = 'https://localhost:4242/qrs/task/table?xrfkey=QW4XPIKvqj1goLux';
     return {
          ...baseOptions,
          url,
          data: {
               entity: 'Task',
               columns: [
                    { name: 'id', columnType: 'Property', definition: 'id' },
                    { name: 'name', columnType: 'Property', definition: 'name' },
                    {
                         name: 'tags', columnType: 'List', definition: 'tag', list: [{ name: 'name', columnType: 'Property', definition: 'name' }, { name: 'id', columnType: 'Property', definition: 'id' }]
                    },
                    { name: 'status', columnType: 'Property', definition: 'operational.lastExecutionResult.status' }
               ]
          }
     };
}


function getTaskLastStatus(taskId) {
     const url = `https://localhost:4242/qrs/task/table?xrfkey=QW4XPIKvqj1goLux&filter=(id+eq+${taskId})`;
     return {
          ...baseOptions,
          url,
          data: {
               entity: 'Task',
               columns: [
                    { name: 'id', columnType: 'Property', definition: 'id' },
                    { name: 'status', columnType: 'Property', definition: 'operational.lastExecutionResult.status' }
               ]
          }
     };
}

module.exports = {
     startTaskById: async taskId => new Promise((resolve, reject) => {
          try {
               axios(getStartTaskOptions(taskId))
                    .then((response) => {
                         resolve(response.data);
                    }).catch((err) => {
                         console.log(err);
                         reject(err);
                    });
          } catch (ex) {
               console.log(ex.message);
               reject(ex);
          }
     }),
     getAllTasks: async () => new Promise((resolve, reject) => {
          try {
               axios(getAllTasksOptions())
                    .then((response) => {
                         const buttonTasksOnlyList = response.data.rows.filter(([, , tagNode]) => {
                              const { rows } = tagNode;
                              return rows.filter(([tagName]) => tagName === 'Button Task').length > 0;
                         });
                         resolve(buttonTasksOnlyList);
                    }).catch((err) => {
                         console.log(err);
                         reject(err);
                    });
          } catch (ex) {
               console.log(ex.message);
               reject(ex);
          }
     }),
     getTaskStatus: async taskId => new Promise((resolve, reject) => {
          try {
               axios(getTaskLastStatus(taskId))
                    .then((response) => {
                         const [taskNode] = response.data.rows;
                         const [, status] = taskNode;
                         resolve(status);
                    }).catch((err) => {
                         console.log(err);
                         reject(err);
                    });
          } catch (ex) {
               console.log(ex.message);
               reject(ex);
          }
     })
};
