//const MongoClient = require('mongodb').MongoClient
const {MongoClient,ObjectID} = require('mongodb')

// Connect to the MongoDB
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log('Error connecting to MongoDB')
    }
    console.log("yes, We connected to MongoDB")

    // delete Many
    /*     db.collection('Todos').deleteMany({text:'Eat Lunch'}).then((result)=>{
                console.log(result)
            },(err)=>{
                console.log('Unable to delete many documents')
            })*/

/*    db.collection('Users').deleteMany({name:'Kiran'}).then((result)=>{
        console.log(result)
    },(err)=>{
        console.log('Unable to delete many documents')
    }) */       
    // deleteOne - Will delete the firstone it finds
/*        db.collection('Todos').deleteOne({text:'Eat Lunch'}).then((result)=>{
            console.log(result)
        },(err)=>{
            console.log('Unable to delete One document')
        })*/

    // findOne and delete - Will target the firstone it finds
/*    db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
        console.log(result)
    },(err)=>{
        console.log('Unable to find one document and delete')
    })*/

    db.collection('Users').findOneAndDelete({_id:new ObjectID('58c7f28f90280e2babb0105c')}).then((result)=>{
        console.log(result)
    },(err)=>{
        console.log('Unable to find one document and delete')
    })

    // Close the DB Connection
    //db.close()
})