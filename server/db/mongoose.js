const mongoose = require('mongoose')

// Tell mongoose we will use ES6 promise
mongoose.Promise = global.Promise 
/*let dbURI = {
    localhost:'mongodb://localhost:27017/TodoApp',
    mlab:'mongodb://todouser:todouser123@ds135680.mlab.com:35680/tododb'
}*/

/*As defualt Heroku and many node hosting companies have
process.env.NODE_ENV === 'production'*/ 
//console.log(process.env.PORT)
//mongoose.connect( process.env.PORT ? dbURI.mlab : dbURI.localhost)

mongoose.connect(process.env.MONGODB_URI)
module.exports= {
    mongoose
}
