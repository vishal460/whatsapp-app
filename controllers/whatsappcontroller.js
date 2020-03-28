const whatsapp = require('../models/whatsapp')
const createprov = require('../models/form')
const accountSid = 'ACba18bb96068d2b0d7947c7ef2a9a6248';
const authToken = 'd1602f68373944fc04fb2aa9d12d1025';
const client = require('twilio')(accountSid, authToken);
const _ = require('lodash')
const sessionStorage = require('node-sessionstorage')
const moment = require('moment')
const request = require('request-promise');
const async = require('async');
const bycript = require('bcrypt')
const session=require('express-session')





const whatsapplist = (req, res) => {
    console.log(req.body)
    console.log('comment',req.body.comment)
    console.log("funworking")
    var whatsno = '+918826362630';
    // messegecount='0';

    var fromm = 'whatsapp:+14155238886';
    //var too = 'whatsapp:'+`${req.body.to}`;
    var too = 'whatsapp:+919599392531';
    var bodyy = req.body.comment.toString();
    var clientid = '5e3b9d4e1fceb93d4e1f5523';
    var cusid = 'cus123';
    var a = 0;

    let message = client.messages
        .create({
            body: bodyy,
            from: fromm,
            to: too
        })
        .then(message => console.log('messege sid issss',message.sid));

    var query = { 'client_id': clientid, 'whatsappno': whatsno },

        update = { id: cusid },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Find the document
    whatsapp.findOneAndUpdate(query, update, options, function (error, result) {
        if (error) {
            console.log(error);
            // res.json(error)
        }
        else {

            result.message_count = result.message_count + 1;
            result.save();
            console.log(result);
            res.redirect('/whatsappdatafetch');    
        }


    });
}
const whatsappdatafetch = (req, res) => {
    
    if(req.session.clientid==null)
    {
       

        res.redirect('/login');
    }
    else{
    let clientId = sessionStorage.getItem('clientid');
    var counter = 0;

    const posts = whatsapp.find().then((result) => {

        let groupClient = _.groupBy(result, 'client_id');

        var datares = groupClient[`${clientId}`]

        for (var i = 0; i < groupClient[`${clientId}`].length; i++) {
            counter = counter + groupClient[`${clientId}`][i].message_count;
        }
        console.log("total countter is " + counter)
        var query = { '_id': sessionStorage.getItem('clientid') },

            options = { new: true, setDefaultsOnInsert: true };


        createprov.findOneAndUpdate(query, options, function (error, results) {

            if (error) {
                console.log(error);
            }
            else {
                var now = new Date();
                var y = now.getFullYear();
                var m = now.getMonth() + 1;
                var d = now.getDate();
                var mm = m < 10 ? '0' + m : m;
                var dd = d < 10 ? '0' + d : d;
                //  y +"/" + mm + "/" + dd;
                var resultlen = results.counters.length;
                console.log("length of counters is " + results.counters.length)
                if (resultlen == 0) {

                    results.counters.push({ "daycount": counter, 'date': y + '-' + mm + '-' + dd })
                    results.save();
                }
                else if (resultlen > 0) {
                    var a = resultlen - 1;
                    console.log("aaaa", a)

                    if (results.counters[a].date == y + '-' + mm + '-' + dd)
                     {
                        let datecounter = 0;
                        for (var k = 0; k < results.counters.length-1; k++)
                       {
                        datecounter = datecounter + parseInt(results.counters[k].daycount);

                        }
                        console.log(datecounter)
                        console.log(counter)
                        var updatecounter = Math.abs(datecounter - counter);
                        console.log("counter date == moment")
                        console.log(results.counters[a].daycount)
                        console.log(counter)

                        results.counters[a].daycount = updatecounter;
                        results.save();
                        console.log('rsult', results)
                    }
                    else if (results.counters[a].date !== y + '-' + mm + '-' + dd) {
                        let datecounter = 0;
                        for (var k = 0; k < results.counters.length; k++)
                       {
                        datecounter = datecounter + parseInt(results.counters[k].daycount);

                        }
                        console.log(datecounter)
                        console.log(counter)
                        var updatecounter = Math.abs(datecounter - counter);
                        console.log("counter date !== moment")
                        results.counters.push({ "daycount": updatecounter, 'date': y + '-' + mm + '-' + dd })
                        results.save();
                    }

                }

            }

        });

        res.render('whatsapp.ejs', {
            data: datares,
            totalcount: counter
        })


    }).catch((err) => {
        res.json(err)
    })
    console.log("routess")
    }
}


const createprovider = async (req, res) => {
    console.log(req.query)
    try {
        req.body.password = bycript.hashSync(req.body.password, 10);
        const formdata = new createprov(req.body)
        var result = await formdata.save();
      //  console.log(result)
                res.render('login.ejs',{message:"valid"})
    } catch (error) {
        res.status(500).send(error);
    }
    

   

}
const providerauth =  async  (req, res) => {
    try{
    console.log("login check")
    var user =  await  createprov.findOne({ 'username': req.body.username}).exec();
   // console.log(user.password,req.body.password)

    if(!user)
    {
         res.render('login.ejs',{
            message: "The username does not exist"
        })
       
    }
    
    if(!bycript.compareSync(req.body.password, user.password))
     {
           res.render('login.ejs',{
            message: "The password is invalid"
        })
       
    }
            req.session.username=user.username;
            req.session.password=user.password;
            req.session.clientid= user._id;
            sessionStorage.setItem(`username`, user.username);
            sessionStorage.setItem(`password`, user.password);
            sessionStorage.setItem(`clientid`, user._id);
            sessionStorage.setItem(`passworddd`, '222');
            console.log('aaaaaaaaaaaaaaaaaaaaaaaa', sessionStorage.getItem('clientid'))
            res.redirect('/whatsappdatafetch')

    }
catch(err){
    console.log("error isssssssssssssssss",err)
   
}

}
const checkcalender = (req, res) => {
    console.log(req.body.from)
    console.log("calender checking")
    var from = req.body.from;
    var to = req.body.to;
    let clientId = sessionStorage.getItem('clientid');
    var query = { '_id': sessionStorage.getItem('clientid') },

        options = { new: true, setDefaultsOnInsert: true };


    createprov.findOneAndUpdate(query, options, function (error, resultsc) {

        if (error) {
            console.log(error);
        }
        else {
            indexfrom = resultsc.counters.findIndex(x => x.date === from);

            console.log(indexfrom);
            indexto = resultsc.counters.findIndex(x => x.date === to);

            console.log(indexto);
            var calcount = 0;
            for (var m = indexfrom; m <= indexto; m++) {
                calcount = calcount + parseInt(resultsc.counters[m].daycount);


            }
            console.log("cal check value", calcount)
        }
        res.send(calcount.toString())

    })
}
const orderlist =async (req,res)=>{
    if(req.session.clientid==null)
    {
        res.redirect('/login');
    }
    else{

    shop = "vishal9599.myshopify.com";
    const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/orders.json';
    // console.log('shopRequestUrl',shopRequestUrl);
    const shopRequestHeaders = {
        'X-Shopify-Access-Token': process.env.accessToken,
    };

    let response = await request.get(shopRequestUrl, { headers: shopRequestHeaders })
    

           let datalength=JSON.parse(response).orders.length;
           console.log("length is",datalength);
           var datass=JSON.parse(response).orders;
            res.render('cusordercrm.ejs',{
                datalen:datalength,
                data:JSON.parse(response).orders
               
           })
        }

}
const googlechart = async (req,res)=>{ 
    var chartarr=[]; 
    var fromarr=[];  
    var resultarr=[];
    var current = new Date();     // get current date    
    var weekstart = current.getDate() - current.getDay() +1;    
    var weekend = weekstart + 6;       // end day is the first day + 6 
    var monday = new Date(current.setDate(weekstart));  
    var sunday = new Date(current.setDate(weekend));
    var weekstart = monday.toString() ; 
    var weekend= sunday.toString();
    chartarr.push(weekstart);

    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    console.log(firstDay)
    chartarr.push(firstDay);
    console.log(chartarr)

    var fullyearstart  = (new Date()).getFullYear()+ "-01-01" ;
    console.log("full year date is",fullyearstart)







    for(var q=0;q<chartarr.length;q++)
    {
    var now = new Date(chartarr[q]);
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var mm = m < 10 ? '0' + m : m;
    var dd = d < 10 ? '0' + d : d;
   
    var from=y + '-' + mm + '-' + dd;
    fromarr.push(from)
    
    }
   // fromarr.push(fullyearstart);
    console.log("from array is",fromarr)
//   var res = str.slice(0, 10);
    var noww = new Date();
    var yy = noww.getFullYear();
    var mm = noww.getMonth() + 1;
    var dd = noww.getDate();
    var mmm = mm < 10 ? '0' + mm : mm;
    var ddd = dd < 10 ? '0' + dd : dd;

    var to=yy + '-' + mmm + '-' + ddd;
    console.log(to)

    
   var user =  await  createprov.findOne({ '_id': sessionStorage.getItem('clientid') }).exec();

        if(!user)
         {
         res.render('login.ejs',{
            
        })
       
          }


          for(var d=0;d<fromarr.length;d++)
          {
              console.log("main for array")
            indexfrom = user.counters.findIndex(x => x.date === fromarr[d]);

            console.log("index from",indexfrom);
            indexto = user.counters.findIndex(x => x.date === to);

            console.log('index to',indexto);
            var calcount = 0;
            for (var m = indexfrom; m <= indexto; m++)
             {
                 console.log("calcount for loop")
                calcount = calcount + parseInt(user.counters[m].daycount);

            }
            resultarr.push(calcount)
        }

        resultarr.push(parseInt(user.counters[indexto].daycount))
        console.log("result array is",resultarr)
        res.send(resultarr);


    
   

  // console.log(from,yy + '-' + mmm + '-' + ddd)

}
const logouts= (req,res)=>{
    sessionStorage.removeItem('clientid');
    req.session.clientid=null;
    if(sessionStorage.getItem('clientid')==null)
    {
        res.redirect('/login');
        console.log("sssssssssssssssssssssssssssssssss",sessionStorage.getItem('clientid'))
    }
    console.log(sessionStorage.getItem('clientid'))

}
const changepass = async (req, res) => {
    try{
        console.log("change passwordddddddddddddd")
    username = req.query.username;
    oldpassword = req.body.oldpassword;
    newpassword = req.body.newpassword;
    console.log(req.body);
    console.log("login check")
    var user =  await  createprov.findOne({ 'username': req.body.username}).exec();
      
        if(!user)
        {
             res.render('changepassword.ejs',{
                message: "The username does not exist"
            })
           
        }
        
        if(!bycript.compareSync(req.body.oldpassword, user.password))
        {
              res.render('changepassword.ejs',{
               message: "The password is invalid"
           })
          
       }
              var   newpassword = bycript.hashSync(req.body.newpassword, 10);
              console.log(newpassword)
                user.password=newpassword.toString();
                user.save();
                res.render('changepassword.ejs',{
                    message: "password changed"
                })
    
        }
    catch(err){
        console.log("error isssssssssssssssss",err)
       
    }

}
const breathingdata = (req,res) =>{
    console.log("aaaaaaaaaaaaaaaaaaaaafdrf5rf4f")
console.log(req.body)
res.render('breathingshow.ejs',{
    inhale: req.body.inhale,
    inhold:req.body.inhold,
    exhale:req.body.exhale,
    exhold:req.body.exhold
})
}
module.exports = { whatsapplist, whatsappdatafetch,changepass,
     createprovider, providerauth, checkcalender,orderlist,googlechart,logouts,breathingdata}