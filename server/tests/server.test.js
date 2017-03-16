const expect  = require('expect')
const request = require('supertest')

const {app} = require('./../server.js')
const {Todo} = require('./../models/todo.js')

//Note: In Mongoose, models can be used to connect to the DBs even the instance of that is not created 

// Create some seed todos
const todos = [
    {
         text: 'This is first todo from seed'
    },
    {
        text:'This is second todo from seed'
    }
]

// Make sure DB  is clean before we test the todos. This run for every test
beforeEach((done)=> {
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos) // Return a promise
    }).then(()=>{
        done()
    })
})

describe('POST /todos',()=>{
    it('should create a new todo',(done)=>{ // done to indicate do it async way
        let text = 'Testing todo text'

        // Use supertest
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text)
            })
            .end((err,res)=>{   // Check the todo was saved in the mongodb
                if(err){
                    return done(err)
                }
                
                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)

                done()    
                }).catch((err)=>{
                    done(err)
                })
            })
    })

    it('should not send bad body data',(done)=>{
        
        // User supetest
        request(app)
            .post('/todos')
            .send({}) // sending an empty object
            .expect(400)
            .end((err,res)=>{
                if(err){
                    return done(err)
                }
                Todo.find().then((todos)=>{
                expect(todos.length).toBe(2)
               // expect(todos[0]).toBe('')
               done()
            }).catch((err)=>{
                done(err)
            })
        })  
    })
})


describe('GET /todos',()=>{
    it('should get all the todos',(done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2)
            })
             .end(done)
    })

})