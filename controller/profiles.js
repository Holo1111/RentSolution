const validator = require('../utilities/validate')
const get_geo = require('../utilities/getGeoLocation')
const client = require('../utilities/db')
const Landlord = require('../model/landlord').Landlord

async function _get_contacts_collection (){
    let db = await client.getDb();
    return await db.collection('profiles');
};


//this method will the help of save method in the landlord model adds a profile in the database
//following the appropriate request values
module.exports.addLandlord = async(req,res)=>{
    let name = req.body.name;
    let email = req.body.email;
    let tel = req.body.tel; 
    let address = req.body.address;

    let new_contact = new Landlord(name,email,tel,address)
    var isValid = await new_contact.isValid() //validating the values
    

    if (isValid){
        let geoData = await get_geo.getGeoLocation(address);
        if (geoData != null){
            new_contact.addGeoCoordinates(geoData[0],geoData[1],geoData[2]);
            
        } 
        let collection = await _get_contacts_collection();
        collection.insertOne(new_contact, (err, obj) => {
            if (err) throw err;
            console.log('1 Contact was inserted in the database');
            res.send('Contact correctly inserted in the Database');
        });
        
    } else {
        console.log('The Contact was not inserted in the database since it is not valid.');
        res.send('Error. Please check your input info again');
    }


}

//this method returns all the address's that the landlord wants to rent for the tenants to view 


module.exports.list_allLandlord = async (req, res) => {
    let collection = await _get_contacts_collection();
    collection.find({}).toArray((err, items)=>{
        if (err) throw err;
        if(items.length == 0){
            console.log('Database is empty');
        }
        console.log(items.length+" item(s) sent.")
        res.send(items);        
    });    
};

// this method returns the specific address of a available house to rent for the tenant to see


module.exports.get_contactLandlord = async (req, res) => {
    let name_to_match = req.params.name;
    let collection = await _get_contacts_collection();
    collection.findOne({"name": name_to_match}, (err, obj)=>{
        if (err) throw err;
        if (obj){
            console.log("User successfully retrieved");        
            res.send({msg: "User successfully retrieved", data: obj});
        }else{
            console.log("There is no user with this name");        
            res.send({msg: "There is no user with this name", data: obj});
        }        
        
    });
        
};

//this method updates the profile of the landlord using the update method in the landlord model


module.exports.update_contactLandlord = async (req, res) => {
    let prev_name = req.params.name;
    let name = req.body.name;
    let email = req.body.email;
    let tel = req.body.tel; 
    let address = req.body.address;
    let isValid = await validator.validate_fields(name, email, tel, address);
    if (isValid){
        let collection = await _get_contacts_collection();
        console.log(name,email,tel,address);
        let new_vals = {$set: {'name': name, 'email': email, 'tel': tel, 'address': address}};
        collection.updateOne({'name': prev_name}, new_vals, (err, obj) => {
            if (err) throw err;
            if (obj.modifiedCount > 0){
                console.log("1 document updated");
                res.send({msg: 'Contact correctly updated.'});
            }else{
                console.log("The document was not updated");
                res.send({msg: 'The new user data is not valid.'});
            } 
        });
    } else {
        console.log("2 The document was not updated");
        let msg = 'The new user data is not valid.';
        res.send(msg);
    }
};

//this method deleted the appropriate record 


module.exports.delete_contactLandlord = async (req, res) => {
    let name_to_delete = req.params.name;
    let collection = await _get_contacts_collection();
    collection.deleteOne({'name': name_to_delete}, (err, obj) => {
        if (err) throw err;
        if (obj.modifiedCount  > 0){
            console.log("1 document deleted");
            res.send({msg: 'Contact deleted.'});
        } else {
            res.send({msg: 'Contact was not found.'});
        }
    });
};




