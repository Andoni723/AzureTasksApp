var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var router = express.Router();

const dotenv = require('dotenv')
dotenv.config()

const DATABASE_CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING;
console.log(DATABASE_CONNECTION_STRING)

const client = new MongoClient(DATABASE_CONNECTION_STRING, { monitorCommands: true });

/* GET home page. */
router.get('/', async function(req, res) {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("AzureTasks").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    const db = client.db("AzureTasks");
    const taskCollection = db.collection("Tasks");
    const tasks = taskCollection.find({});
    var taskArray = []
    for await (const task of tasks) {
      taskArray.push({taskName: task.taskName, taskUser: task.taskUser});
    }
    const jsonString = JSON.stringify(taskArray, null, 2);
    console.log(jsonString);
    res.render('index', { title: 'Azure Tasks', azureTasks: jsonString });
  } 
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

module.exports = router;
