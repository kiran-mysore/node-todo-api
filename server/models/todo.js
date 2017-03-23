const mongoose = require('mongoose')

// Create Todo Model
const Todo = mongoose.model('Todo',{
    text:{
        type:String,
        required:true,
        trim:true,
        minlength:1
    },
    completed:{
        type:Boolean,
        default:false
    },
    completedAt:{
        type:Number,
        default:null
    },
    _creator:{
        require:true,
        type:mongoose.Schema.Types.ObjectId
    }
})

module.exports = {
    Todo
}