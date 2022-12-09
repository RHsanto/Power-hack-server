
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const express = require('express');
const cors = require('cors')
const app =express();
const port = process.env.PORT || 8000;

//midalware
app.use(cors());  
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mr-travel-app.aqkf7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {

  try {
    await client.connect();
    const database = client.db("billingInfo");
    const BillCollection = database.collection("billingList");
    const UserCollection = database.collection("UserList");
    
   


 // GET BILLING API
 app.get('/billing-list', async (req,res)=>{
  const cursor = BillCollection.find({});
  const page = req.query.page;
  const size = parseInt(req.query.size);
  const count = await cursor.count();
  let bills;
  if(page){
    bills = await cursor.skip(page*size).limit(10).toArray();
  }
  else{
    bills = await cursor.toArray();
  }
  res.send({
    count, 
    bills});
  
 });


  // here post station data
  app.post('/add-billing', async (req,res) => {
    const user = req.body;
    const result = await BillCollection.insertOne(user);
    res.json( result)
  })


  // here register 
  app.post('/registration', async (req,res) => {
    const user = req.body;
    const result = await UserCollection.insertOne(user);
    res.json( result)
  })
  // here register 
  app.post('/login', async (req,res) => {
    const user = req.body;
    const result = await UserCollection.insertOne(user);
    res.json( result)
  })

 //DELETE API 
 app.delete('/delete-billing/:id', async(req,res)=>{
  const id     = req.params.id;
  const query  = {_id:ObjectId(id)} ;
  const result = await BillCollection.deleteOne(query)
  res.json(result);
 })

   // UPDATE STATUS 
   app.put('/update-billing/:id', async(req,res)=>{
    const body =req.body;
    const id = req.params.id;
    const filter ={_id: ObjectId(id)}
    const option = {upsert : true};
    const updateStatus ={
      $set:{
       name:body.name,
       email:body.email,
       phone:body.phone,
       amount:body.amount,
      },
    };
    const result = await BillCollection.updateOne(filter,updateStatus,option);
    res.json(result)
  })

  } 
  
  finally {
   // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
  res.send('Running the server on Power Hack');
})
app.listen(port, () => {
  console.log('Running the server on Power Hack',port)
})
