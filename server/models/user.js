const mongoose = require('mongoose')
const validator = require('validator') // npm library for various validations
const jwt = require('jsonwebtoken')
const _ = require('lodash')

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        minlength:1,
        trim:true,
        unique:true,
        validate:{  // Check for custom validation in mongoose library docs
            isAsync: true,
            validator:validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password:{
        minlength:6,
        type:String,
        required:true
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
})

/*This is mongoose specific method used to send the properties that we want to send back and avoid sending sensitive data*/

UserSchema.methods.toJSON = function(){
    let user = this
    let userObject = user.toObject() // convert the mongoose object to regular one
    return _.pick(userObject,['_id','email'])
}

// Create some instance methods on the Schema
UserSchema.methods.generateAuthToken = function(){ // I am using regukar fun as I need this
    let user = this
    let access = 'auth'
    let token = jwt.sign({_id:user._id.toHexString(),access:access},'SecretSalt').toString()
   
    // add the token values into the User token array
    user.tokens.push({access:access,token:token})

    // Return the token and handle it server.js
    return user.save().then(()=>{
        return token
    })

}
// Create a User Model
const User = mongoose.model('User',UserSchema)

/*const User = mongoose.model('User',{
    email:{
        type:String,
        required:true,
        minlength:1,
        trim:true,
        unique:true,
        validate:{  // Check for custom validation in mongoose library docs
            validator:validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password:{
        minlength:6,
        type:String,
        required:true
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
})*/


module.exports = {
    User
}