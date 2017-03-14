//const MongoClient = require('mongodb').MongoClient
const {MongoClient,ObjectID} = require('mongodb')

// Connect to the MongoDB
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log('Error connecting to MongoDB')
    }
    console.log("yes, We connected to MongoDB")

  // Findone and update
     // findOneAndUpdate(filter,update,options,callback)
 // $set is a mongodb operator - check the mongodb operators 
 /* db.collection('Todos').findOneAndUpdate(
      { 
          _id : new ObjectID('58c7f00a90280e2babb00fed')
      },
      {
          $set:{
              completed:true
          }
       },
      {
          returnOriginal:false
      }
      ).then((result)=>{
         console.log(result)
         },(err)=>{
           console.log('Unable to findone document and update it')
         })*/

    db.collection('Users').findOneAndUpdate(
        {
            _id : new ObjectID('58c7f2b590280e2babb01069')
        },
        {
            $set:{
                name:'Ravi'
            },
            $inc:{
                age:-10
            }
        },
        {
            returnOriginal:false // This will make not return the old document which was updated
        }
        ).then((result)=>{
            console.log(result)
        },(err)=>{
            console.log('Unable to findone document and update it')
        })     
    // Close the DB Connection
    //db.close()
})