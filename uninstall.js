const { Service } = require('node-windows');

// Create a new service object
const svc = new Service({
     name: 'INKA Teklif E-posta Servisi',
     description: 'INKA Teklif E-posta Servisi',
     script: 'C:\\Program Files\\Qlik\\Sense\\inkaqs\\src\\index.js',
     // , workingDirectory: '...'
     // , allowServiceLogon: true
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('uninstall', () => {
     console.log('Service successfully uninstalled.');
});

svc.uninstall();
