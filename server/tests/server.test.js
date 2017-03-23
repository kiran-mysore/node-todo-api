const {ObjectID} = require('mongodb')
const expect  = require('expect')
const request = require('supertest')
const _ = require('lodash')



const {app} = require('./../server.js')
const {Todo} = require('./../models/todo.js')
const{UserModel} = require('./../models/user.js')
const {todos,populateTodos,users,populateUsers} = require('./seed/seed.js')

//Note: In Mongoose, models can be used to connect to the DBs even the instance of that is not created 

// Make sure DB  is clean before we test the todos. This run for every test
beforeEach(populateUsers)
beforeEach(populateTodos)

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

describe('GET /users/me',()=>{

    it('should return a user if authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString())
            expect(res.body.email).toBe(users[0].email)
        })
        .end(done)

    })
    it('should return a 401 if not authenticated',(done)=>{

        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            // expect(_.isEmpty(res.body)) 
             expect(res.body).toEqual({}) 
        })
        .end(done)
    })
})

describe('POST /users',()=>{

    it('should create a user',(done)=>{
        // Create unique email and password
        let email='example@test.com'
        let password='example123'
        request(app)
        .post('/users')
        .send({
            email:email,
            password:password
        })
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toExist()
            expect(res.body._id).toExist()
            expect(res.body.email).toBe(email)
        })
        //.end(done)
        .end((err)=>{ // custom method
            if(err){
                return done(err)
            }

            UserModel.findOne({email}).then((user)=>{
                expect(user).toExist()
                expect(user.password).toNotBe(password) // because the password is hashed and not equal
                done()
            }).catch((err)=>{
                  done(err)
            })
        })
    })
    it('should return a validation errors if request is invalid',(done)=>{
        let wrongEmail = 'test'
        let password='wrong123'
        request(app)
        .post('/users')
        .send({
            email:wrongEmail,
            password:password
        })
        .expect(400)
        .end(done)
    })
    it('should not create a user if the email is already used',(done)=>{
        let existingEmail = users[0].email // Getting from the seed data and it exists in the DB
        let password='admin123'

        request(app)
        .post('/users')
        .send({
            email:existingEmail,
            password:password
        })
        .expect(400)
        .end(done) 
    })
})

describe('POST /users/login',()=>{
    it('should login user and return auth token',(done)=>{

        request(app)
        .post('/users/login')
        .send({
            email:users[1].email,
            password:users[1].password
        })
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toExist()
        })
        .end((err,res)=>{
            if(err){
                return done(err)
            }
            UserModel.findById(users[1]._id).then((user)=>{
                expect(user.tokens[0]).toInclude({
                    access:'auth',
                    token:res.headers['x-auth']
                })
                done()
            }).catch((err)=>{
                done(err)
             })
        })

    })
    it('should reject the invalid user',(done)=>{
/*        let wrongEmail = 'test'
        let password='wrong123'
        request(app)
        .post('/users/login')
        .send({
            email:wrongEmail,
            password:password
        })
        .expect(400)
        .end(done)*/
        request(app)
        .post('/users/login')
        .send({
            email:users[1].email,
            password:users[1].password + 1
        })
        .expect(400)
        .expect((res)=>{
            expect(res.headers['x-auth']).toNotExist()
        })
        .end((err,res)=>{
            if(err){
                return done(err)
            }
            UserModel.findById(users[1]._id).then((user)=>{
                expect(user.tokens.length).toBe(0)
                done()
            }).catch((err)=>{
                done(err)
             })
        })


    })

})