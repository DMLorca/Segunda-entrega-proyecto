const {CarritosDaoMongoDb} = require('./carrito/carritoDaoMongoDb');
const {ProductoDaoMongoDb} = require('./producto/productoDaoMongoDb');
const {CarritosDaoFirebase} = require('./carrito/carritoDaoFirebase');
const {ProductosDaoFirebase} = require('./producto/productoDaoFirebase');

const mongoose = require("mongoose");

var admin = require("firebase-admin");

var serviceAccount = require("../basefirebase-73c4d-firebase-adminsdk-438d7-a9bcb1a035.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://basefirebase-73c4d.firebaseio.com"
});

const dbChart = admin.firestore();
const queryChart = dbChart.collection("carrito");

const instCarroFire = new CarritosDaoFirebase(dbChart, queryChart);

const dbProd = admin.firestore();
const queryProd = dbProd.collection("producto");

const instProdFire = new ProductosDaoFirebase(dbProd, queryProd);









mongoose.connect("mongodb://localhost:27017/database");

const carroSchema = new mongoose.Schema({

    title: { type: String, required: false },
    description: { type: String, required: false },
    code: { type: String, required: false },
    timestamp: { type: String, required: false },
    stock: { type: Number, required: false },
    price: { type: Number, required: false },
    thumbnail: { type: String, required: false },
    id: { type: Number, required: false },
    idc: { type: Number, required: false }

})
const carro = mongoose.model("carrito", carroSchema);

instCarroMongo = new CarritosDaoMongoDb(carro);

const prodSchema = new mongoose.Schema({

    title: { type: String, required: false },
    description: { type: String, required: false },
    code: { type: String, required: false },
    timestamp: { type: String, required: false },
    stock: { type: Number, required: false },
    price: { type: Number, required: false },
    thumbnail: { type: String, required: false },
    id: { type: Number, required: false }
})
const producto = mongoose.model("producto", prodSchema);
const instProdMongo = new ProductoDaoMongoDb(producto);

/* module.exports.instCarro = instCarro;
module.exports.instProd = instProd; */

module.exports = {instProdMongo, instCarroMongo, instCarroFire, instProdFire};

