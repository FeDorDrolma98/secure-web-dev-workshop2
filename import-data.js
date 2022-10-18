require('dotenv').config()

// Test ecriture promesses et connection--------------
const mongoosy={connect:(param)=>new Promise((resolve,reject)=>setTimeout(()=>resolve('Connected'+param),Math.random()*3600))}
async function main (){
    //ca enrobe la fonction dans une promesse, reussi ou echoue
    const results=await Promise.all([mongoosy.connect(1),mongoosy.connect(2),mongoosy.connect(3)])
    console.log(results)// la fait tableau avec tout, du coup penalisé par le plus lent
    const speed=await Promise.race([mongoosy.connect(1),mongoosy.connect(2),mongoosy.connect(3)])
    console.log(speed)// la mets que le plus rapide
    const result=await mongoosy.connect(1)
    console.log(result)
    const result2=await mongoosy.connect(2)
    console.log(result2)
    const result3=await mongoosy.connect(3)
    console.log(result3)//on attend que chaque code soit fini avant la suite (cf await)
}
//console.log(main())//-------------------------------


//console.log(process.env.MONGO_URI);
const mongoose=require('mongoose');
mongoose.connect(process.env.MONGO_URI).then((res)=>console.log('connecté')).catch((e)=>console.log(e));

//on fait un doc a coté pour éviter de rentrer le mdp en dur
//ici, MONGO_URI a password dedans, on le remplace par notre mdp

//en fait mongoose.connect, c'est une fonction assychrone, c'est une promesse.
// quand s'execute, on a aucune preuve que ca ai marché
// les fonction promesse, soit elles reussissent (appelle .then), soit elle echoue (appelle .catch)
//la on connecte, puis on met .then(et la truc entre parenthese qu'il va faire)
//.then((res)=>trucsicamarche.catch((e)=>trucsicamarchepas) -->on a ecrit res, mais result ca marche aussi
//la trucsicamarchepas:console.log(e), mais on aurai pu juste ecrire n'importe quoi


const LocationSchema=mongoose.Schema({//on fait un template en fait
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
const Location=mongoose.model('Location',LocationSchema,'locations');
//module.exports=mongoose.model("Locations",locationMod);
const filmingLocations=require('./lieux-de-tournage-a-paris.json');//faut le mettre dans le dossier avant of course


function populate(){
    for(const elem of filmingLocations){
        const locat=new Location({
            "filmType": elem['fields']['type_tournage'],
            "filmProducerName": elem['fields']['nom_producteur'],
            "endDate": elem['fields']['date_fin'],
            "filmName": elem['fields']['nom_tournage'],
            "district": elem['fields']['ardt_lieu'],
            "geolocation": elem['fields']['geometry'],
            "sourceLocationId": elem['fields']['id_lieu'],
            "filmDirectorName": elem['fields']['nom_realisateur'],
            "address": elem['fields']['adresse_lieu'],
            "startDate": elem['fields']['date_debut'],
            "year": elem['fields']['annee_tournage'],
        });
        locat.save().then((res)=>console.log('enregistré !')).catch((e)=>console.log(e));
    }
}

async function populate2(){
    //si on fait pas wait sur le .save, ca va tous les lancer d'un coup
    //si un fail, tu saura pas lequel

    let promisesChunk=[];
    for(const filmingLocation of filmingLocations){
        const toInsert=new Model({})
        promisesChunk.push(toInsert.save())//la on attend pas, on lance toutes les insertions
        if(promisesChunk.length===500){
            await Promise.all(promisesChunk)//car si vrmt bcp prends du temps
            promisesChunk=[]
        }
    }
    const results=await Promise.all(promisesChunk)//la on attend que toutes les insertions se finissent, et du coup
}

function queryOneLoca(id){
    //const query=Location.find();
    //query.setOptions({lean:true});

    //query.collection(Location.collection); //bug et a pas l'air nécessaire
    // test 1 : console.log(query.where('_id').gte(id));
    // test 1 : console.log(query.$where(function(){return this._id===id}));
    // test 2 : console.log(Location.findOne({'_id':id}));
    // test 3 : const doc= Location.findOne({_id:"ObjectId('"+id+"')"});
    const doc= Location.findOne({_id:id});
    console.log(doc);

}
queryOneLoca('63332292db08aee5dea35777');

function queryAllLoca(filmName){
    //const query=Location.find();
    //query.setOptions({lean:true});
    const doc= Location.findOne({'filmName':filmName});
    console.log(doc);
}
//queryAllLoca("Une jeune fille qui va bien");

function delOneLoca(id){
    Location.deleteOne({_id:id});
}
//queryAllLoca("Une jeune fille qui va bien");

function addOneLoca(type,producer,enddate,name,district,geoloc,sourceloc,director,address,startdate,year){
    const locat=new Location({
        "filmType": type,
        "filmProducerName": producer,
        "endDate": enddate,
        "filmName": name,
        "district": district,
        "geolocation": geoloc,
        "sourceLocationId": sourceloc,
        "filmDirectorName": director,
        "address": address,
        "startDate":startdate,
        "year": year,
    });
    locat.save().then((res)=>console.log('enregistré !')).catch((e)=>console.log(e));
}

function updOneLoca(typeAmodif,amodif){
    Location.updateOne({typeAmodif:amodif},function(err,res){});
}