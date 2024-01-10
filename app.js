const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 5000
app.use(bodyParser.json()); // support json encoded bodies



const profiles = require('./controller/profiles')
const profileTenants = require('./controller/profilesTenant') // Here we import our code with the contacts operations
const mongo = require('./utilities/db')

var server

async function loadDBClient() {
  await mongo.connectToDB();
};  
loadDBClient();

app.use(express.static(__dirname + '/view'));

//async function createServer(){
    //try{
    // we will only start our server if our database
    // starts correctly. Therefore, let's wait for
    // mongo to connect
       
        // profiles resource paths

app.get('/landlords',profiles.list_allLandlord)
app.get('/tenants',profileTenants.list_allTenant)
app.get('/landlords/:name',profiles.get_contactLandlord)
app.get('/tenants/:name',profileTenants.get_contactTenant)
app.post('/landlords',profiles.addLandlord)
app.post('/tenants',profileTenants.addTenant)
app.put('/landlords/:name',profiles.update_contactLandlord)
app.put('/tenants/:name',profileTenants.update_contactTenant)
app.delete('/landlords/:name',profiles.delete_contactLandlord)
app.delete('/tenants/:name',profileTenants.delete_contactTenant)
      
server = app.listen(port, () => {
  console.log('Example app listening at http://localhost:%d', port);
});



// when for when we kill the server. 
// This will avoid us to create many mongo connections
// and use all our computer resources
process.on('SIGINT', () => {
  console.info('SIGINT signal received.');
  console.log('Closing Mongo Client.');
  mongo.closeDBConnection();
  server.close(() => {
    console.log('Http server closed.');
  });
});