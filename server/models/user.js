const mongoose = require('mongoose')

// Create a User Model
const User = mongoose.model('User',{
    email:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    }
})


module.exports = {
    User
}