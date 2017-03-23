const {ObjectID} = require('mongodb')
const jwt =require('jsonwebtoken')

const {Todo} = require('./../../models/todo.js')
const {UserModel} = require('./../../models/user.js')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()

// Create sone seed users

const users = [
    {
        _id: userOneId,
        email:'admin@example.com',
        password:'admin123',
        tokens:[{
            access:'auth',
            token: jwt.sign({_id:userOneId,access:'auth'},'SecretSalt').toString()
        }]
    },
    {
        _id: userTwoId,
        email:'test@example.com',
        password:'test123'
    }
]

// Create some seed todos
const todos = [
    {   
         _id: new ObjectID(),
         text: 'This is first todo from seed'
    },
    {
        _id: new ObjectID(),
        text:'This is second todo from seed',
        completed:true,
        completedAt:333
    }
];


const populateTodos = (done)=> {
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos) // Return a promise
    }).then(()=>{
        done()
    })
}

const populateUsers = (done) => {
    UserModel.remove({}).then(()=>{
       let userOne = new UserModel(users[0]).save();
       let userTwo = new UserModel(users[1]).save();
       return Promise.all([userOne,userTwo]) // Return a promise
    }).then(()=>{
        done()
    })
}

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}