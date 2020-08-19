const express = require('express');
const engines = require('consolidate');
const app = express();

var bodyParser = require("body-parser");
const { parse } = require('path');
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://huong_dep_zai:Nnxd9MPkmJiFLouY@cluster0.qxyey.mongodb.net/HuongShop";

app.get('/', async (req, res) => {
    let client = await MongoClient.connect(url, { useUnifiedTopology: true });
    let dbo = client.db("HuongShop");
    let results = await dbo.collection("products").find({}).toArray();
    res.render('index', { model: results });
})
app.get('/allProduct', async (req, res) => {
    let client = await MongoClient.connect(url, { useUnifiedTopology: true });
    let dbo = client.db("HuongShop");
    let results = await dbo.collection("products").find({}).toArray();
    res.render('allProduct', { model: results });
})
server = app.listen(process.env.PORT || 5000, (err) => {
    if (err) { console.log(err) } else {
        console.log('thanh cong');
    }
});
app.get('/delete', async (req, res) => {
    let inputId = req.query.id;
    let client = await MongoClient.connect(url);
    let dbo = client.db("HuongShop");
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(inputId) };
    await dbo.collection("products").deleteOne(condition);
    res.redirect('/allProduct');
})
app.get('/insert', (req, res) => {
    res.render('insert');
})
app.post('/doInsert', async (req, res) => {
    let inputName = req.body.txtName;
    let inputMSP = req.body.txtMSP;
    let inputSL = req.body.txtSL;
   let inputPrice = req.body.txtPrice;
    // NaN: Not a number
    // isNaN(value); neu no la so tra false , true;
    let newProduct = { name: inputName, MSP: inputMSP, Sl: inputSL, Price: inputPrice };
    if (inputName.length == 0 || inputSL <= 0) {
        let modelError = { SlError: "so luong < 1 de nghi nhap them so luong san pham!", nameError: "error name!", mspError: "error msp!" };
        res.render('insert', { model: modelError });
    }
    else {
        let client = await MongoClient.connect(url);
        let dbo = client.db("HuongShop");
        await dbo.collection("products").insertOne(newProduct);
        res.redirect('/allProduct');
    }


})
app.post('/doSearch', async (req, res) => {
    let inputName = req.body.txtName;
    let client = await MongoClient.connect(url);
    let dbo = client.db("HuongShop");
    // let results = await dbo.collection("Student").find({name:inputName}).toArray();
    let results = await dbo.collection("products").find({ name: new RegExp(inputName, 'i') }).toArray();
    res.render('allProduct', { model: results });

})
app.get('/update', async function (req, res) {
    let id = req.query.id;
    console.log(id)
    let client = await MongoClient.connect(url, { useUnifiedTopology: true });
    let dbo = client.db("HuongShop");
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };
    let results = await dbo.collection("products").find(condition).toArray();
    res.render('update', { model: results });
})
app.post('/doupdate', async (req, res) => {
    let id = req.body.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };
    console.log(condition)
    let client = await MongoClient.connect(url, { useUnifiedTopology: true });
    let dbo = client.db("HuongShop");
    change = {
        $set: {
            name: req.body.txtName,
            MSP: req.body.txtMSP,
            Sl: req.body.txtSL,
            Price: req.body.txtPrice
        }
    }
    await dbo.collection("products").updateOne(condition, change);
    res.redirect('/allProduct');
})
