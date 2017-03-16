const expect  = require('expect')
const request = require('supertest')

const {app} = require('./../server.js')
const {Todo} = require('./../models/todo.js')


// Make sure DB  is clean before we test the todos. This run for every test
beforeEach((done)=>{
    Todo.remove({}).then(()=>{
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
                
                Todo.find().then((todos)=>{
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
                expect(todos.length).toBe(0)
               // expect(todos[0]).toBe('')
               done()
            }).catch((err)=>{
                done(err)
            })
        })  
    })
})