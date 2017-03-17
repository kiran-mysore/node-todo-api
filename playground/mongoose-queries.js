const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

// Existing object todo id from the MongoDB database
const todoID = '58caf385dd5c350c7c14d1c0'
const userID = '58cbf554064c67440379e48d'

// Check for id not valid
 if(!ObjectID.isValid(todoID)){
    console.log('ID not valid')
 }

/*// Find the todo document based on mongoose find method which results in an array
Todo.find({
    _id:todoID // Here mongoose converts the string value into ObjectID value automatically
}).then((todos)=>{
    console.log(`Todo array:\n${todos}`) // Prints array of todos in this case only one
})

// Find one document 
Todo.findOne({
    _id:todoID
}).then((todo)=>{
    console.log(`Todo object:\n${todo}`) // Print todo object
})*/

Todo.findById(todoID).then((todo)=>{
    if(!todo){
        return console.log('ID not found in the DB')
    }
     console.log(`Todo by Id:\n${todo}`) // Print todo object
}).catch((err)=>{
    console.log(err)
})

User.findById(userID).then((user)=>{
    if(!user){
        return console.log('User not found in the DB')
    }
    console.log(`User found by Id is : ${user}`)
}).catch((err)=>{
    console.log(err)
})