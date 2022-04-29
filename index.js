const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const objectId = require('mongodb').ObjectId
const app = express();

const port = process.env.PORT || 5000;

// middle were 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('server is running')
})

// user: dbuser1
// password: Xn1tAxX6UrRx2hTq



const uri = "mongodb+srv://dbuser1:Xn1tAxX6UrRx2hTq@cluster0.oosyr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    const userCollection = client.db("foodExpress").collection("users")

    // get usere method
    app.get('/user', async (req, res) => {
      const query = {}
      const cursor = userCollection.find(query)
      const users = await cursor.toArray();
      res.send(users)
    })
    app.get('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: objectId(id)}
      const result = await userCollection.findOne(query);
      res.send(result);
    })
    // post method
    app.post('/user', async (req, res) => {
      const newUser = req.body;
      console.log('adding new user', newUser);
      const result = await userCollection.insertOne(newUser)
      res.send(result)
    })

    // update user put method
    app.put('/user/:id', async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const filter = {_id: objectId(id)};
      const options = {upsert: true};
      const updatedDoc = {
        $set: {
          name: updateUser.name,
          email: updateUser.email,
          password: updateUser.password
        }
      };
      const result = await userCollection.updateOne(filter, updatedDoc, options);
      res.send(result)
    })

    // delete user method
    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: objectId(id)}
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

  }finally{
    // await client.close();
  }
}

run().catch(console.dir)

app.listen(port, () => {
    console.log(`Server is running at localhost ${port}`)
});
