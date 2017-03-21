const {ObjectID} = require('mongodb')
const expect  = require('expect')
const request = require('supertest')


const {app} = require('./../server.js')
const {Todo} = require('./../models/todo.js')

//Note: In Mongoose, models can be used to connect to the DBs even the instance of that is not created 

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

describe('GET /todos/:id',()=>{
    it('should return a todo for an ID',(done)=>{
        request(app)
        .delete((`/todos/${todos[0]._id.toHexString()}`))
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done)
    })

    it('should return 404 error if todo not found',(done)=>{
        let dummyID = new ObjectID()
        request(app)
        .get((`/todos/${dummyID.toHexString()}`))
        .expect(404)
        .end(done)

    })

    it('should return 404 if non-object IDs',(done)=>{
        request(app)
        .get('/todos/123')
        .expect(404)
        .end(done)
    })
})

describe('DELETE /todos/:id',()=>{
    it('should delete to todo',(done)=>{
        let hexTodoId = todos[1]._id.toHexString()

        request(app)
        .delete(`/todos/${hexTodoId}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(hexTodoId)
        })
        .end((err,res)=>{
            if(err){
               return done(err)
            }
           // Query the DB to find the deleted id does not exist
           Todo.findById(hexTodoId).then((todo)=>{
             expect(todo).toNotExist()
             done()
           }).catch((err)=>{
                 done(err)
            })
        })
    })

    it('should return a 404 error if ID not found',(done)=>{
        let dummyID = new ObjectID()
        request(app)
        .delete((`/todos/${dummyID.toHexString()}`))
        .expect(404)
        .end(done)
    })

    it('should return 404 error if the ID is not valid',(done)=>{
        request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done)
    })
})

describe('PATCH /todos/:id',()=>{
    it('should update the todo properties',(done)=>{
        let hexTodoId = todos[0]._id.toHexString()
        let dummyText = 'Updated using the PATCH test case'
        request(app)
        .patch(`/todos/${hexTodoId}`)
        .send({
            completed:true,
            text:dummyText
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(dummyText)
            expect(res.body.todo.completed).toBe(true)
            expect(res.body.todo.completedAt).toBeA('number')
        })
        .end(done)
    })

    it('should clear the completedAt property when todo is not completed',(done)=>{
        let hexTodoId = todos[1]._id.toHexString()
        let dummyText = 'Updated using the PATCH test case-2!!'
        request(app)
        .patch(`/todos/${hexTodoId}`)
        .send({
            completed:false,
            text:dummyText
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(dummyText)
            expect(res.body.todo.completed).toBe(false)
            expect(res.body.todo.completedAt).toNotExist()
        })
        .end(done)
    })
})