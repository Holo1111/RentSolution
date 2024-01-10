var assert = require('assert');
const { Landlord } = require('../model/landlord');
const { Tenant } = require('../model/tenant');
const validation = require('../utilities/validate')
const axios = require('axios');
var myurl = 'http://localhost:3000';           
//the base url
const instance = axios.create({
    baseURL: myurl,
    timeout: 5000, //5 seconds max
    headers: {'content-type': 'application/json'}
});

describe('RentSolution App v4 - Tests with Mocha', function(){
    describe('Test Models', function(){
        describe('Profile', function(){
            let cname = 'Amilcar Soares';
            let cemail = 'amilcarsj@mun.ca';
            let ctel = '709-456-7891'
            let caddress = '230 Elizabeth Ave, St. John\'s, Newfoundland'
            var contact = new Landlord(cname, cemail, ctel, caddress);       
            // it('Test creation of a valid user with parameters matching', function(){                
            //     assert.strictEqual(contact.name, 'Amilcar Soares');
            //     assert.strictEqual(contact.email, 'amilcarsj@mun.ca');
            //     assert.strictEqual(contact.tel, '709-456-7891');
            //     assert.strictEqual(contact.address, '230 Elizabeth Ave, St. John\'s, Newfoundland');
            // });
            // it('Test if user is invalid function (Invalid Name)', async function(){
            //     let c = new Contact('Amilcar2_Soare$', cemail, ctel, caddress);
            //     assert.strictEqual(await validation.validate_fields(c.name, c.email, c.tel, c.address), false);
            // });
            it('Test if user is invalid function (Invalid Email)', async function(){
                let c = new Landlord(cname, 'amilcarsj@mun@ca.13', ctel, caddress);
                assert.strictEqual(await validation.validate_fields(c.name, c.email, c.tel, c.address), false);
            });
            it('Test if user is invalid function (Invalid Tel)', async function(){
                let c = new Landlord(cname, cemail, '70X11122X2', caddress);
                assert.strictEqual(await validation.validate_fields(c.name, c.email, c.tel, c.address), false);
            });
        });
    });
    describe('Test API calls', function(){
        describe('tenants', async function(){            
            it('Fail 1. POST - Test invalid name in the object', async function(){
                let data = {
                    name: '12Asj/@3_', 
                    email: 'amilcarsj@mun.ca', 
                    tel: '709-456-7891', 
                    address: '230 Elizabeth Ave, St. John\'s, Newfoundland'
                }
                let res = await instance.post('/landlords', data);
                assert.strictEqual(res.data, 'Error. User not inserted in the database.');                
            });
            it('Fail 2. POST - Test invalid email in the object', async function(){
                let data = { 
                            name: 'Amilcar Soares', 
                            email: 'amilX@domain@x./@3_', 
                            tel: '709-456-7891', 
                            address: '230 Elizabeth Ave, St. John\'s, Newfoundland'
                        };
                let res = await instance.post('/landlords', data)
                assert.strictEqual(res.data, 'Error. User not inserted in the database.');                
            });
            it('Fail 3. POST - Test invalid tel in the object', async function(){
                let data = { 
                    name: 'Amilcar Soares', 
                    email: 'amilcarsj@mun.ca', 
                    tel: 'InvalidXtel', 
                    address: '230 Elizabeth Ave, St. John\'s, Newfoundland'
                };
                let res = await instance.post('/landlords', data)
                assert.strictEqual(res.data, 'Error. User not inserted in the database.');                
            });
            it('Fail 4. GET - /landlords/:address (No user with name)', async function(){
                let user_name = 'Someone Unknown';
                let res = await instance.get('/landlords/'+user_name)
                assert.strictEqual(res.data,'No item was found');                  
            });
            it('Fail 5. DELETE - /landlords/:address (No user with name)', async function(){
                let user_name = 'Someone Unknown';
                let res = await instance.delete('/landlords/'+user_name);
                assert.strictEqual(res.data,'Contact was not found');
            });
            it('Fail 6. PUT - /landlords/:address (No user with name)', async function(){
                let data = { 
                    name: 'Someone Unknown', 
                    email: 'amilcarsj@mun.ca', 
                    tel: 'InvalidXtel', 
                    address: '230 Elizabeth Ave, St. John\'s, Newfoundland'
                };
                let res = await instance.put('/landlords/'+data.name, data);
                assert.strictEqual(res.data,'The new user data is not valid.');
            });
            it('Success 1. POST - Valid User, DELETE - User', async function(){
                let data = {
                    name: 'John Smith', 
                    email: 'jsmith@mun.ca', 
                    tel: '709-456-7891', 
                    address: '235 Forest Road, St. John\'s, Newfoundland'
                }
                let res_post = await instance.post('/landlords', data)
                assert.strictEqual(res_post.data, 'Contact correctly inserted in the Database.');
                let res_del = await instance.delete('/landlords/'+data.name);
                assert.strictEqual(res_del.data, 'Contact was deleted.');                
            });
            it('Success 2. POST - Valid User, GET - /landlords (Greater 0), DELETE - User', async function(){
                let data = { 
                    name: 'Amilcar Soares', 
                    email: 'amilcarsj@mun.ca', 
                    tel: '709-221-6612', 
                    address: '230 Elizabeth Ave, St. John\'s, Newfoundland'
                };
                let res_post = await instance.post('/landlords', data)
                let res_get = await instance.get('/landlords')
                if (res_get.data.length < 1 ) {
                    assert.fail('There should be elements in the database');
                }
                let res_del = await instance.delete('/landlords/'+data.name);
                assert.strictEqual(res_del.data, 'Contact was deleted.');                
            });
            it('Success 3. POST - Valid User, GET - :name, DELETE - User', async function(){
                let data = {
                    name: 'Bob Churchil', 
                    email: 'bchurchil@mun.ca', 
                    tel: '709-987-6543', 
                    address: '50 Crosbie Road, St. John\'s, Newfoundland'
                };
                let res_post = await instance.post('/landlords', data)
                let res_get = await instance.get('/landlords/'+data.name)
                assert.strictEqual(res_get.data.name, data.name);
                assert.strictEqual(res_get.data.email, data.email);
                assert.strictEqual(res_get.data.tel, data.tel);
                assert.strictEqual(res_get.data.address, data.address);
                let res_del = await instance.delete('/landlords/'+data.name);
                assert.strictEqual(res_del.data, 'Contact was deleted.');                
            });
            it('Success 4. POST - Valid User, UPDATE - :name, GET - /:name, DELETE - User', async function(){
                let data = {
                    name: 'Robert Doe', 
                    email: 'rob@mun.ca', 
                    tel: '709-917-6643', 
                    address: '150 Torbay Road, St. John\'s, Newfoundland'
                };
                let up_data = {
                    name: 'Robert Doe Jr', 
                    email: 'robs@mun.ca', 
                    tel: '709-917-6643', 
                    address: '105 Torbay Road, St. John\'s, Newfoundland'
                };
                let res_post = await instance.post('/landlords', data)
                let res_put = await instance.put('/landlords/'+data.name, up_data);
                assert.strictEqual(res_put.data,'Contact correctly updated.');
                let res_get = await instance.get('/landlords/'+up_data.name)
                assert.strictEqual(res_get.data.name, up_data.name);
                assert.strictEqual(res_get.data.email, up_data.email);
                assert.strictEqual(res_get.data.tel, up_data.tel);
                assert.strictEqual(res_get.data.address, up_data.address);
                let res_del = await instance.delete('/landlords/'+up_data.name);
                assert.strictEqual(res_del.data, 'Contact was deleted.');                
            });            
        });        
    });
    
});