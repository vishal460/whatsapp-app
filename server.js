const express = require('express')
const app = express()
const dotenv=require('dotenv').config()
const mongoose=require('mongoose')
const morgan=require('morgan')
const bodyparser=require('body-parser')
const crypto=require('crypto')
const cookie = require('cookie')
const nonce=require('nonce')
const queryString = require('querystring')
const request = require('request-promise')
const mongooseclient=require('mongoose-client')
const expressvalidator = require('express-validator')
const port=process.env.port || 8080
var path=require('path');
const whatsapps=require('./routes/whatsapprouter')
//const postcontroller=require('../controllers/post')
const sessionStorage = require('node-sessionstorage')
const session=require('express-session')
const cookieParser=require('cookie-parser')



const scopes="read_products,write_products,read_product_listings,read_customers,write_customers, read_orders , write_orders ,read_checkouts, write_checkouts,read_script_tags, write_script_tags";
const apiSecret='83f98face94e7a85119111033e6e39cd';
const apiKey='690ad35c39b8c1323d317f9b99f59119';
const shop='vishal9599.myshopify.com';


app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json())
app.use(express.static(path.join(__dirname,'public')));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat',saveUninitialized:true, resave:true, cookie: { maxAge: 60000 }}))

const showw=(req,res,next) => {
  if(sessionStorage.getItem('clientid')!==null)
  {
  console.log("hhhhhhhhhhhhhhhhhhhhmiddleware")   ///morgan is use in middile of the processes
   next();
  }
}
app.use(showw)///middleware declare use it end or first accordingly
app.set('view engine', 'ejs');


const URI='mongodb+srv://vishal460:vishal460@cluster0-rtqn9.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(URI, { useNewUrlParser: true,useUnifiedTopology: true }).
then(()=>{
console.log(" db connected")}).catch((err)=>console.log(`eror is ${err}`))

// app.get('/',(req,res)=>{
//   console.log("shopinn")
//   const shop = req.query.shop;
//   if (shop) 
//   {
//     console.log("shopinn2")
//     const state = nonce();
//     const redirectUri =  forwardingAddress + '/shopify';
//     const installUrl = 'https://' + shop +
//       '/admin/oauth/authorize?client_id=' + apiKey +
//       '&scope=' + scopes +
//       '&state=' + state +
//       '&redirect_uri=' + redirectUri;
// console.log('installUrl',installUrl);
//     res.cookie('state', state);
//     res.redirect(installUrl);
//   }
//    else
//    {
//     return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
//   }
// });

// app.get('/shopify', (req, res) => {
//   console.log("in1")
//   const { shop, hmac, code, state } = req.query;
//   console.log(req.query)
//   console.log("in2")
//   if (shop && hmac && code) {
//     console.log("in3")
//     // DONE: Validate request is from Shopify
//     const map = Object.assign({}, req.query);
//     delete map['signature'];
//     delete map['hmac'];
//     const message = queryString.stringify(map);
//     const providedHmac = Buffer.from(hmac, 'utf-8');
//     const generatedHash = Buffer.from(
//       crypto
//         .createHmac('sha256', apiSecret)
//         .update(message)
//         .digest('hex'),
//         'utf-8'
//       );
//     let hashEquals = false;
//     console.log("in4")
//     try {
//       console.log("in5")
//       hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
//     } catch (e) {
//       hashEquals = false;
//     };

   
//     const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
//     const accessTokenPayload = {
//       client_id: apiKey,
//       client_secret: apiSecret,
//       code,
//     };

//     request.post(accessTokenRequestUrl, { json: accessTokenPayload })
//     .then((accessTokenResponse) => {
      
//       const accessToken = accessTokenResponse.access_token;
//       console.log("accessToken"+accessToken);
     
//       const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/shop.json';
//       const shopRequestHeaders = {
//         'X-Shopify-Access-Token': accessToken,
//       };

//       request.get(shopRequestUrl, { headers: shopRequestHeaders })
//       .then((shopResponse) => {
        
//         res.render('createprovider.ejs',{
//                 status:"****"
//               })
//       })
//       .catch((error) => {
       
//         res.status(error.statusCode).send(error.error.error_description);
//       });
//     })
//     .catch((error) => {
      
//       res.status(error.statusCode).send(error.error.error_description);
//     });

//   } else {
//     res.status(400).send('Required parameters missing');
//   }
// });

// app.get('/', (req, res) => { 
//     res.render('createprovider.ejs',{
//       status:"****"
//     })
//   })
  app.get('/',(req,res)=>{
    res.render('login.ejs',{message:""})
  })
app.get('/changepassword',(req,res)=>{
  res.render("changepassword.ejs", {
    message: ""
})
});
app.get('/forgetpassword',(req,res)=>{
  res.render('forgetpassword.ejs')
})
app.get('/br',(req,res)=>{
  res.render('breathingform.ejs')
})
app.get('/dowhatsapp',(req,res)=>{
  res.render('whatsappsend.ejs')
})

app.use('',whatsapps)


app.use(morgan('dev'))

//app.use(expressvalidator());
app.listen(port,()=>console.log(" server connected"))

{/* <script>
var m2mConn = [{"id":{S:"11"},"M2mConnectionPhotoButtonId":{S:"PB09"}},
                {"id":{S:"10"},"M2mConnectionPhotoButtonId":{S:"PB07"}},
                {"id":{S:"12"},"M2mConnectionPhotoButtonId":{S:"PB06"}}]
var photosAsPerType = {"Nameplate":[],"Equipment":[]}
var photoButtons =[{"id":{S:"PB09"},"photoType":{S:"Nameplate"}},
                    {"id":{S:"PB07"},"photoType":{S:"Tag"}},
                    {"id":{S:"PB06"},"photoType":{S:"Equipment"}}]
                    
          
        
         var fac=1;
const countdown = async (value) => {
  console.log('Start')



var str=value;
console.log(str.length);
  if(str.length>1)
 {
    var array = await str.split("");
    console.log("array is",array)
    var sum=0;
    for(  var i=0;i<array.length;i++)
    {
       sum= await sum+Number(array[i])
    }
  var summ=await sum.toString();
  if(summ.length>1)
   {
   countdown(summ);

   }
   else
   {
   console.log("last sum is",summ);
   }
 }



}
 //countdown("555555555555555222222222222222222222255555555555555555555555");                   
</script>  */}
