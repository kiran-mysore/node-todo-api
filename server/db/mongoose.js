const mongoose = require('mongoose')

// Tell mongoose we will use ES6 promise
mongoose.Promise = global.Promise 

mongoose.connect('mongodb://localhost:27017/TodoApp')

module.exports= {
    mongoose
}