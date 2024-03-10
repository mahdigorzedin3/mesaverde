const express = require('express');
const app = express()
const session=require('express-session')
const cookieparser= require('cookie-parser')
var fs = require('fs');
const path = require('path');
const mysql =require('mysql2')
const url = require('url')
const jwt = require('jsonwebtoken')
var bodyParser = require('body-parser');


app.use(cookieparser())
app.use(session({
    secret:'dksj933iueddowd',
    resave:true,
    saveUninitialized:true,
    name:'yourin'
}))

const mimetype={
    "html" : "text/html",
    "css" : "text/css",
    "json" : "application/json"
}
var con = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"27031861",
    database:"mesaverde"
})

app.use( bodyParser.json() );  
app.use(bodyParser.urlencoded({  
  extended: true
})); 



app.get('/' ,(req,res)=>{
    app.use(express.static('/home/mahdi-gorzedin/Desktop/project'));
    res.sendFile(path.resolve(__dirname,'shop.html'))
})
const secret = 'thisshouldbeasecret';


  app.post("/login",async (req, res) => {
    const { email, password } = req.body;
    var sql=`SELECT * FROM customersinfo WHERE email = '${email}' AND password = ${password} `
    const user = await new Promise((resolve, reject) => {
        con.query(sql,function(err,result){
            if(err) console.log(err)
            resolve(result)
        })})
    
    if (user[0]) {
      // Create a JWT token with the user ID as the payload
      const token = jwt.sign({ userId: user[0].number}, secret,{
        expiresIn: '1h',
        });
        req.session.nonauth=false
        req.session.save()
        res.cookie('jwt',token, { httpOnly: true, secure: true, maxAge: 3600000 })
        res.cookie('name',user[0].fullname,{ httpOnly: false, secure: true, maxAge: 3600000 })
        res.redirect('/')
    } else {
        req.session.nonauth=true
        req.session.save()
        res.redirect('/signin/')
        
    }
  });
app.get('/signip/nonauth',(req,res)=>{
    if(req.session.nonauth){
        res.json('ایمیل یا رمز ورود شما اشتباه است !')
    }
})

app.get('/signup/', (req,res)=>{
    app.use(express.static('/home/mahdi-gorzedin/Desktop/project/signup'))
    res.setHeader("content-type" , mimetype)
    res.status(200).sendFile('/home/mahdi-gorzedin/Desktop/project/signup/signup.html')
} )
app.get('/signin/', (req,res)=>{
    app.use(express.static('/home/mahdi-gorzedin/Desktop/project/signin'))
    res.setHeader("content-type" , mimetype)
    res.status(200).sendFile('/home/mahdi-gorzedin/Desktop/project/signin/signin.html')
} )


app.post('/create',(req,res)=>{
    var info = req.body
    var data =[];
    for(let key in info){
        data.push(info[key])
}
    var sql = "INSERT INTO customersinfo (fullname, email, number, password) VALUES ?";
    var bing =[data];
    con.query(sql,[bing],function (err, result) {
        if (err) console.log(err);
    })
    const token = jwt.sign({ userId: info.number}, secret,{
        expiresIn: '1h',
        });
       res.cookie('jwt',token, { httpOnly: true, secure: true, maxAge: 3600000 })
        res.cookie('name',info.fullname,{ httpOnly: false, secure: true, maxAge: 3600000 })
        res.redirect('/')
});

app.get('/products/',(req,res)=>{
    var q =url.parse(req.url,true).query;
    var bin = q.id;
        let sql ="SELECT * FROM products WHERE id = " + bin;
        con.query(sql,function(err,result){
            if (err) console.log(err);
            global.gij =result[0];
        if(err) console.log(err);
        })
    res.setHeader("content-type" , mimetype)
    app.use(express.static('/home/mahdi-gorzedin/Desktop/project/pro'))
    res.sendFile(path.resolve(__dirname,'products/pro.html'),function(err){
        if(err) console.log(err);
    })
})

app.get('/gson',(req,res)=>{
    res.json(global.gij)
})

app.get('/proimg', (req,res)=>{
    res.send(global.gij.image)
})

app.post('/cart',(req,res)=>{
    var q =url.parse(req.url,true).query;
    var din = q.id;
    req.session.cart=req.session.cart || []
    if(!req.session.cart.includes(din))req.session.cart.push(din)
    req.session.save()
})

app.post('/cartshop',(req,res)=>{
    try{
        var sql ="SELECT * FROM products WHERE id = "+req.session.cart[0]
    for(let x of req.session.cart){
        sql+= " OR id = "+x;
    }
    con.query(sql,function(err,result){
        res.json(result)
    })
    }catch(err){
    }
    
})
app.post('/cart/remove',(req,res)=>{
    var t =url.parse(req.url,true).query;
    var num = t.id;
    const index = req.session.cart.indexOf(num);
    req.session.cart.splice(index, 1)
    req.session.save()

})

app.post('/cartimg', (req,res)=>{
    var sql ="SELECT image FROM products WHERE id = "+req.session.cart[0]
    for(let x of req.session.cart){
        sql+= " OR id = "+x;
    }
    con.query(sql,function(err,result){
        if (err) console.log(err);
        res.send(result)
    if(err) console.log(err);
    })
})



app.get('/shopcart',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'cart.html'))
})
app.listen(5000)
