//const MongoClient = require('mongodb').MongoClient
const {MongoClient,ObjectID} = require('mongodb')

// Connect to the MongoDB
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log('Error connecting to MongoDB')
    }
    console.log("yes, We connected to MongoDB")

/*    db.collection('Todos').find({
        completed:true,
        _id:new ObjectID('58c7d32a90280e2babb00d82')}).toArray().then((docs)=>{
        console.log('Todos')
        console.log(JSON.stringify(docs,undefined,2))
    },(err)=>{
        console.log('Error while fetching the document')
    })*/

/*    db.collection('Users').find().count().then((count)=>{
        console.log(`The count of documents is : ${count}`)
       
    },(err)=>{
        console.log('Error while fetching the document')
    })    */

    db.collection('Users').find({name:'Kiran'}).toArray().then((users)=>{
        console.log(JSON.stringify(users,undefined,2))
    },(err)=>{
        console.log('Error while getting Users')
    })

// Close the DB Connection
db.close()
})