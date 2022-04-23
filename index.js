const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;
// dbuser1
// jl7oOFWFT7nJ6HR7


//connction code of mongodb

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dbuser1:jl7oOFWFT7nJ6HR7@cluster0.9votr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//for inserting a data
async function run() {
    try {
        await client.connect();
        const userCollection = client.db("foodExpress").collection("user");
        // create a document to insert
        //add data manually
        /* const user = { name: 'Mango', price: 600 }
        const result = await userCollection.insertOne(user);
        console.log(`A document was inserted with the _id: ${result.insertedId}`); */

        //using user add data to db
        app.post('/users', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await userCollection.insertOne(data);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.send(data);
        });

        // load data all from db
        app.get('/users', async (req, res) => {

            const query = {};
            const cursor = userCollection.find(query);
            console.log(cursor);

            const result = await cursor.toArray();
            res.send(result);
        });

        //load single data from db
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        //upate a data
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: body.name,
                    email: body.email
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        //delete data from db
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


//middleware
app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server run successfully')
});

app.listen(port, () => {
    console.log('Node Mongo Crud is Running on port', port)
})