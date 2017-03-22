const {UserModel} = require('./../models/user.js')

// Custom middleware function
const authenticate = (req,res,next)=>{
    let token = req.header('x-auth')
    UserModel.findByToken(token).then((user)=>{
        if(!user){
            Promise.reject()
        }
        
        // update the request object
        req.user = user
        req.token = token
        next()
    }).catch((err)=>{
        res.status(401).send(err) // Authentication required error
    })
}

module.exports = {
    authenticate
}