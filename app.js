const express = require('express')
// create express object
const app = express()
// Reading the data from the .env variables
const dotenv = require('dotenv')
dotenv.config()

// For logging purpose

const Port = process.env.PORT || 3333
const bodyparser=require('body-parser')

const morgan = require('morgan')
const fs = require('fs')
const cors = require('cors')
const mongo = require('mongodb')


let MongoClient = mongo.MongoClient;
let mongoUrl = process.env.MongoLive;
let db;




// middlewares
app.use(morgan('short', { stream: fs.createWriteStream('./app.logs') }))
app.use(cors())
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())




app.get('/', (req, res) => {
    res.send('Hi this is zomato api')
})
// Get cities
app.get('/location', (req, res) => {
    db.collection('location').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)



    })
})

// get restaurant wrt stateId
// queryparams
app.get('/restaurant', (req, res) => {
    let query = {}
    let stateId = Number(req.query.stateId)
    let mealId = Number(req.query.mealId)


    if (stateId) {
        query = { state_id: stateId }
    }
    else if (mealId) {
        query = { "mealTypes.mealtype_id": mealId }
    }

    db.collection('restaurant').find(query).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})
// Filter  section params

app.get('/filter/:mealId', (req, res) => {
    let query = {}
    let sort={}
    let mealId = Number(req.params.mealId)
    let cuisineId = Number(req.query.cuisineId)
    let lprice = Number(req.query.lprice)
    let hprice = Number(req.query.hprice)
    let sortprice=Number(req.query.sortprice)
    
    if (sortprice) {
        sort = {
            cost: sortprice
        }
    }

    if(cuisineId && lprice && hprice){
        query={
            "mealTypes.mealtype_id":mealId,
            "cuisines.cuisine_id":cuisineId,
            $and:[{cost:{$gt:lprice,$lt:hprice}}]

        }
    }
  
   else if (cuisineId) {
        query = {
            "mealTypes.mealtype_id": mealId,
            "cuisines.cuisine_id": cuisineId
        }

    }
    else if (lprice && hprice) {
        query = {
            "mealTypes.mealtype_id": mealId,
            $and: [{ cost: { $gt: lprice, $lt: hprice } }]
        }
    }

    db.collection('restaurant').find(query).sort(sort).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})


// fetching meals
app.get('/mealtypes', (req, res) => {
    db.collection('mealtypes').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)

    })
})



// Details
app.get('/details/:id',(req,res)=>{
    let id=Number(req.params.id)
    db.collection('restaurant').find({restaurant_id:id}).toArray((err,result)=>{
        if(err) throw err
        res.send(result)
    })
})
// Restaurant Menu Details
app.get('/menu/:id',(req,res)=>{
    let id=Number(req.params.id)
    db.collection('menu').find({restaurant_id:id}).toArray((err,result)=>{
        if(err) throw err
        res.send(result)
    })
})
// Place Order POsT Request
app.post('/placeorder',(req,res)=>{
    console.log(req.body)
    db.collection('orders').insertOne(req.body,(err,result)=>{
        if(err) throw err
        res.send("Order Placed")
    })
})
// menuDetails
// app.post('/menuItems',(req,res)=>{
//     if(Array.isArray(req.body.id)){
//         db.collection('menu').find({menu_id:{$in:req.body.id}}).toArray((err,result)=>{
//             if(err) throw err
//             res.send(result)
//         })
//     }else{
//         res.send("invalid input")
//     }
// })


app.post('/menuItem',(req,res) => {
    console.log(req.body);
    db.collection('menu').find({menu_id:{$in:req.body}}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
    
})
// Fetch orders Get
app.get('/orders',(req,res)=>{
    let query={}
    let email=req.query.email
    if(email){
        query={email:email}
    }
    db.collection('orders').find(query).toArray((err,result)=>{
        if(err) throw err
        res.send(result)
    })

})
// Update the order Put
app.put('/updateOrder/:id',(req,res)=>{
    console.log(req.body)
    let id=Number(req.params.id)
    db.collection('orders').updateOne({orderId:id},{$set:{
        "status":req.body.status,
        "bank_name":req.body.bank_name,
        "date":req.body.date
    }},(err,result)=>{
        if(err) throw err
        res.send("order updated")
    })

})

app.delete('/deleteOrder/:id',(req,res)=>{
    let id=Number(req.params.id)
    db.collection('orders').deleteOne({orderId:id},(err,result)=>{
        if(err) throw err
        res.send("order deleted")
    })

})




// connection with db

MongoClient.connect(mongoUrl, (err, client) => {
    if (err) console.log("error while connecting");
    db = client.db('zomato')
    app.listen(Port, () => {
        console.log(`the app is successfully listin at ${Port}`)
    })
})





