const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

// Local imports
const {mongoose} = require('./db/mongoose.js')
const{Todo} = require('./models/todo.js')
const{User} = require('./models/user.js')

// Create app
const app = express()

// configure the body-parser middleware to receive json from the client
app.use(bodyParser.json())

// Routes
// Create a new Todo
app.post('/todos',(req,res)=>{
    console.log(req.body) // Output the request from the client - which is json now.
    let todo = new Todo({
        text:req.body.text
    })
    todo.save().then((doc)=>{
        res.send(doc)
    },(err)=>{
        console.log('Unable to save the todo document',err)
        res.status(400).send(err)
    })
})

// Get all the todos
app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos})
    },(err)=>{
         res.status(400).send(err)
    })
})

// Get todo by id
app.get('/todos/:id',(req,res)=>{
    //res.send(req.params)
    let todoId = req.params.id
    if(!ObjectID.isValid(todoId)){
        res.status(404).send() // Nothing to send
    }else{
        Todo.findById(todoId).then((todo)=>{
            if(!todo){
                console.log('The ID does not exist')
                res.status(404).send() // Nothing to send
            }
            res.send({todo})
        }).catch((err)=>{
            res.status(400).send()
        })
    }

})

// Server listening
app.listen(3000,()=>{
    console.log('Started on port : 3000')
})


// Create an instance of Todo
/*let myTodo = new Todo({
    text:'Cook Dinner'
})*/

/*let anotherTodo = new Todo({
    text:'Read a Novel',
    completed:true,
    completedAt:10
})*/

/*let feeCat = new Todo({
    text:'Feed the cat',
    completed:false,
    completedAt:123

})*/

/*let validTodo = new Todo({
    text:'A Valid todo'
})*/

// Save the Todo document
/*myTodo.save().then((doc)=>{
    console.log('Saved the Todo document',doc)
},(err)=>{
    console.log('Unable to save the todo document',err)
})*/

/*anotherTodo.save().then((doc)=>{
    console.log('Saved the Todo document',doc)
},(err)=>{
     console.log('Unable to save the todo document',err)
})*/

/*feeCat.save().then((doc)=>{
    console.log(JSON.stringify(doc,undefined,2))
},(err)=>{
    console.log('Unable to save the todo document',err)
})*/

/*validTodo.save().then((doc)=>{
    console.log(JSON.stringify(doc,undefined,2))
},(err)=>{
    console.log('Unable to save the todo document',err)
})*/



/*let adminUser = new User({
    email:'admin@test.com'
})

adminUser.save().then((user)=>{
     console.log(JSON.stringify(user,undefined,2))
},(err)=>{
    console.log('Unable to save the user document',err)
})*/

module.exports = {
    app
}