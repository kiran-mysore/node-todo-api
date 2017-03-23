require('./config/config.js')
const _= require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')


// Local imports
const {mongoose} = require('./db/mongoose.js')
const{Todo} = require('./models/todo.js')
const{UserModel} = require('./models/user.js')
const {authenticate} = require('./middleware/authenticate.js')

// Create app
const app = express()

// Set the port for deployment(Heoku) or defualt local port
const port = process.env.PORT || 3000


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
        res.status(404).send() // Nothing but 404 error status
    }else{
        Todo.findById(todoId).then((todo)=>{
            if(!todo){
                //console.log('The ID does not exist')
                res.status(404).send() // Nothing to send
            }
            res.send({todo})
        }).catch((err)=>{
            res.status(400).send()
        })
    }

})

// Delete todo by id
app.delete('/todos/:id',(req,res)=>{
    let todoId = req.params.id
    if(!ObjectID.isValid(todoId)){
        res.status(404).send() // Nothing but 404 error status
    }
        Todo.findByIdAndRemove(todoId).then((todo)=>{
            if(!todo){// If no IDs found
                res.status(404).send() // Nothing but 404 error status
            } 
            res.send({todo})
        }).catch((err)=>{
            res.status(400).send()
        })
    
})

// Update a todo
// We are using a PATCH method because we just update few properties. 
// We could have used PUT if we completely replacing the object.
app.patch('/todos/:id',(req,res)=>{
    
    let todoId = req.params.id

    // grab the text and the completed properties from the request body
    let body = _.pick(req.body,['text','completed'])

    if(!ObjectID.isValid(todoId)){
       res.status(404).send() // Nothing but 404 error status
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime()
    }else{
        body.completed = false
        body.completedAt = null
    }

    // Now Update the DB 
    // new:true will make not return the old document which was updated. This is mongoose specific
    Todo.findByIdAndUpdate(todoId,{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send()
        }

        // If updated send the todo object back as response
        res.send({todo})
    }).catch((err)=>{
        res.status(400).send()
    }) 
})

/*POST /users routes*/

app.post('/users',(req,res)=>{
    //console.log(req.body) // Output the request from the client - which is json now.

    // grab the email and password properties from the request body
    let body = _.pick(req.body,['email','password'])

    // Create a new Instance of the user-model
    let user = new UserModel(body) // Note: here body is an object

    // Save the user to the DB
    user.save().then(()=>{
        return user.generateAuthToken()
        //res.status(200).send({savedUser})
    }).then((token)=>{
        
        // Send this token as the http header
        res.header('x-auth',token).send(user)
        
    })
    .catch((err)=>{
        res.status(400).send(err)
    })

})



app.get('/users/me',authenticate,(req,res)=>{
        res.send(req.user)
    })


app.post('/users/login',(req,res)=>{
     // grab the email and password properties from the request body
     let body = _.pick(req.body,['email','password'])
     //res.send(body)

     UserModel.findByCredentials(body.email,body.password).then((user)=>{
         return user.generateAuthToken().then((token)=>{
            // Send this token as the http header
            res.header('x-auth',token).send(user)
        })
     }).catch((err)=>{
         res.status(400).send()
     })
})

app.delete('/users/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send()
    },(err)=>{
        res.status(400).send()
    })
})


/*app.get('/users/me',(req,res)=>{
    let token = req.header('x-auth')
    UserModel.findByToken(token).then((user)=>{
        if(!user){
            Promise.reject()
        }
        res.send(user)
    }).catch((err)=>{
        res.status(401).send(err) // Authentication required error
    })

})*/

// Server listening
app.listen(port,()=>{
    console.log(`Server started at port : ${port}`)
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