const express = require('express');
const engines = require('consolidate');
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://huong_dep_zai:Nnxd9MPkmJiFLouY@cluster0.qxyey.mongodb.net/HuongShop";

app.get('/',(req,res)=>{
    res.render('index');
})
app.get('/products' ,async(req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("HuongShop");
    let results = await dbo.collection("products").find({}).toArray();
    res.render('allProduct',{model:results});
})
server = app.listen(5000,(err) =>{
    if (err){ console.log(err)} else{
        console.log('thanh cong');
    }
} );
app.get('/delete',async (req,res)=>{
    let inputId = req.query.id;
    let client= await MongoClient.connect(url);
    let dbo = client.db("HuongShop");
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(inputId)};
    await dbo.collection("products").deleteOne(condition);
    res.redirect('/products');
})
app.get('/insert',(req,res)=>{
    res.render('insert');
})
app.post('/doInsert',async (req,res)=>{
    let inputName = req.body.txtName;
    let inputMSP = req.body.txtMSP;
    let inputSL = req.body.txtSL;
    let newProduct = {name : inputName, MSP:inputMSP, Sl: inputSL};
    if(inputName.trim().length == 0){
        let modelError = {nameError:"chua co ten!"};
        res.render('insert',{model:modelError});}
        else{    
            let client= await MongoClient.connect(url);
            let dbo = client.db("HuongShop");
            await dbo.collection("products").insertOne(newProduct);
            res.redirect('/products');}


})
app.post('/doSearch',async (req,res)=>{
    let inputName = req.body.txtName;
    let client= await MongoClient.connect(url);
    let dbo = client.db("HuongShop");
    // let results = await dbo.collection("Student").find({name:inputName}).toArray();
    let results = await dbo.collection("products").find({name: new RegExp(inputName,'i')}).toArray();
    res.render('allProduct',{model:results});

})
