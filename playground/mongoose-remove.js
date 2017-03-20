const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

// Existing object todo id from the MongoDB database
/*const todoID = '58cfda42b305ddcd9884892a'
const userID = '58cbf554064c67440379e48d'*/

// There are 3 ways we can remove documents

// --- This removes all the docs ---
/*Todo.remove({}).then((result)=>{
    console.log(result);
})*/


// --- This removes the first occurance of a document ----
/*Todo.findOneAndRemove({
    _id:'58cfda4fb305ddcd9884892b'
}).then((todo)=>{
    console.log(todo)
})*/

// --- This will find and remove a specific document ---
/*Todo.findByIdAndRemove('58cfdbe00b4a6dcefcbb0f64').then((todo)=>{
    console.log(todo)
})*/




// Check for id not valid
 /*if(!ObjectID.isValid(todoID)){
    console.log('ID not valid')
 }
*/
