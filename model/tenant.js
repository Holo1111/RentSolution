
const v = require('../utilities/validate')


// here we create our Tenant model to manipulate the tenant obejct 

class Tenant{
    constructor(name,email,tel,address){
        this.name = name
        this.email = email
        this.tel = tel
        this.address = address
    }

    async isValid(){
        return v.validate_fields(this.name, this.email, this.tel, this.address);
    }

    addGeoCoordinates(lat,lng,provider){ // method to get the longtitude and latitude
        this.lat = lat
        this.lng = lng
        this.provider = provider
    }

}

module.exports.Tenant = Tenant