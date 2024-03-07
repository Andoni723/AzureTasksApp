var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var router = express.Router();

const dotenv = require('dotenv')
dotenv.config()

const DATABASE_CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING;
console.log(DATABASE_CONNECTION_STRING)

const client = new MongoClient(DATABASE_CONNECTION_STRING, { monitorCommands: true });

/* Insert task to DB. */
router.get('/insertTasks', async function(req, res) {
try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("AzureTasks").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db("AzureTasks");
    const taskCollection = db.collection("Tasks");

    const task = {
        "taskId": 3498,
        "taskName": "Validar aplicación web Node.js",
        "taskUser": "Andoni",
        "taskCompleted": true
    }
    const result = await taskCollection.insertOne(task);
    console.log(`A task was inserted with the _id: ${result.insertedId}`);
    res.render('insert', { title: 'Insert', message: 'Insert done!' });
} 
finally {
    // Ensures that the client will close when you finish/error
    await client.close();
}
});

module.exports = router;