import * as express from 'express'
import * as session from 'express-session'
import * as cookieParser from 'cookie-parser'
import * as path from 'path';
import * as url from "url";
import * as jwt from 'jsonwebtoken'
import * as bodyParser from 'body-parser';
import * as dotenv from "dotenv";
import * as cors from 'cors'
import { PrismaClient } from './meti-prisma/node_modules/@prisma/client'
const app = express()
const prisma = new PrismaClient()
app.use(cookieParser())
dotenv.config()
app.use(cors());
app.use(session({
  secret:'dksj933iueddowdhuih',
  resave:true,
  saveUninitialized:true,
  name:'yourin'
}))



app.use( bodyParser.json() );  
app.use(bodyParser.urlencoded({  
  extended: true
})); 
    app.use(express.static(path.resolve(__dirname,'public')))
declare module 'express-session' {
            interface SessionData {
              errauth:boolean;
              doublemail:boolean;
              cart:number[];
              pro:object;
            }
          }

  app.get('/' ,(req,res)=>{

    res.sendFile(path.resolve(__dirname,'public','shop.html'))
})
const secret = 'thisshouldbeasecret';

const user={

}

  app.post("/login",async (req, res) => {
    const { email, password } = req.body;
    const user:{
      fullname:string,
      email:string,
      number:string,
      password:string
    }|null= await prisma.customersinfo.findUnique({
      where:{
        email:email,
        password:password
      },
    })

    if (user?.fullname) {
      const token = jwt.sign({ number: user.number , email : user.email , fullname :user.fullname , password : user.password }, 'mypublicprojectkey',{
        expiresIn: '2h',
        });
        req.session.errauth=false
        req.session.save()
        res.cookie('jwt',token, { httpOnly: true, secure: true, maxAge: 3600000 })
        res.redirect('/')
    } else {
        req.session.errauth=true
        req.session.save()
        res.redirect('/signin/')
        
    }
  });
app.get('/signip/nonauth',(req,res)=>{
    if(req.session.errauth){
        req.session.errauth=false
        req.session.save()
        res.json('ایمیل یا رمز ورود شما اشتباه است !')
    }
})

app.get('/usr/data',(req,res)=>{
	jwt.verify(req.cookie.jwt, 'mypublicprojectkey', (err, authorizedData) => {
            if(err){
                console.log('توکن شما نامعتبر است !');
                res.sendStatus(403);
            } else {
                //If token is successfully verified, we can send the autorized data 
                res.json({
                    message: 'Successful log in',
                    authorizedData
                });
            }
        })
})

app.get('/signup/', (req,res)=>{
    res.status(200).sendFile(path.resolve(__dirname,'public','signup','signup.html'))
} )
app.get('/signin/', (req,res)=>{
    res.status(200).sendFile(path.resolve(__dirname,'public','signin','signin.html'))
} )


app.post('/create',async (req,res)=>{
    const {fullname,email,number,password} =req.body
	console.log(email)
    var registe= await prisma.customersinfo.findFirst({
        where:{
            email:email
        }
    })
    if(registe?.fullname){
        req.session.doublemail=true
        req.session.save()
        res.redirect('/signup/')
    }else{
        req.session.doublemail=false
	req.session.save()
        const putuser=await prisma.customersinfo.create({
            data:{
                fullname:fullname,
                email:email,
                number:number,
                password:password
            }
        })
	const token = jwt.sign({ number: user.number , email : user.email , fullname :user.fullname , password : user.password }, 'mypublicprojectkey',{
        expiresIn: '2h',
        });
        res.cookie('jwt',token, { httpOnly: true, secure: true, maxAge: 3600000 })
        res.redirect('/')
}})
    
app.get('/create/error',(req,res)=>{
    if(req.session.doublemail){
        req.session.doublemail=false
        req.session.save()
        res.json('اکانت دیگری با این ایمیل ساخته شده است!')
    }
})
    

app.get('/products/',async(req,res)=>{
    var q =url.parse(req.url,true).query;
    if(q?.id){
        var product=await prisma.products.findUnique({
            where:{
                id:+q.id
            }
        })
    if(product?.brand){
    req.session.pro=product
    req.session.save()
    res.sendFile(path.resolve(__dirname,'public','products/pro.html'))
    }else{
        res.redirect('/')
    } 
}
    else{
        res.redirect('/')
    }})

app.get('/gson',(req,res)=>{
    res.json(req.session.pro)
})

app.post('/cart',(req,res)=>{
    var q =url.parse(req.url,true).query;
    if(q?.id){
        req.session.cart=req.session.cart || []
        if(!req.session.cart.includes(+q.id))req.session.cart.push(+q.id)
        req.session.save()
    }
})

app.post('/cartshop',async(req,res)=>{
        if(req.session?.cart){
        var cartproduct=await prisma.products.findMany({
            where:{
                id:{in:req.session.cart}
            }
    })
    
    res.json(cartproduct)
        }else{
            res.json(undefined)
        }
    
    
})
app.post('/cart/remove',(req,res)=>{
    var q =url.parse(req.url,true).query;
    if(q?.id&&req.session?.cart){
    const index = req.session.cart.indexOf(+q.id);
    req.session.cart.splice(index, 1)
    req.session.save()
    }
    

})
app.get('/shopcart',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'public','cart.html'))
})
app.listen(5000)


