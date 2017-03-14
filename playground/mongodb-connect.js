//const MongoClient = require('mongodb').MongoClient
const {MongoClient,ObjectID} = require('mongodb')
// Note: We can use ObjectID to create objectIDs for documents as follows
let obj  = new ObjectID()
console.log(obj)

// Obejct destructuring
const user = {name:'kiran',age:42}
let {name,age} = user;
console.log(name, age)

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log('Error connecting to MongoDB')
    }
    console.log("yes, We connected to MongoDB")

    // Insert a new Todo document into the collection Todos
 /*   db.collection('Todos').insertOne({
        text:'Something to do',
        completed:false
    },(err,result)=>{
        if(err){
            return console.log('Unable to insert todo',err)
        }

        console.log(JSON.stringify(result.ops,undefined,2))
    })*/

    // Insert a new User document into the collection Todos

/*    db.collection('Users').insertOne({
        name:'Kiran',
        age:42,
        location:'Malmö'
    },(err,result)=>{
        if(err){
            return console.log('Unable to insert user document',err)
        }
        console.log(JSON.stringify(result.ops,undefined,2))
        console.log(result.ops[0]._id.getTimestamp())
    })
*/
    db.close()
})