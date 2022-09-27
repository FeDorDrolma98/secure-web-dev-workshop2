require('dotenv').config()

//console.log(process.env.MONGO_URI);

const mongoose=require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const Locations=mongoose.Schema({//on fait un template en fait
    "filmType": String,
    "filmProducerName": String,
    "endDate": Date,//avant : {type:Date,default:Date.now}, mais mieux que pas de default, mieux que pas d'infos plutot que de fausses infos
    "filmName": String,
    "district": String,//Number possible aussi
    "geolocation": {type:String,coordinates:[Number]}, //format GeoJSON
    "sourceLocationId": String,
    "filmDirectorName": String,
    "address": String,
    "startDate": Date,//avant : {type:Date,default:Date.now}, mais mieux que pas de default, mieux que pas d'infos plutot que de fausses infos
    "year": String,//Number possible aussi
})