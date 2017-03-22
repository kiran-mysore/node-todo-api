const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

let password = 'testpassword'

// generate the salt and hash to store in the db
bcrypt.genSalt(10,(err,salt)=>{ // more the number harder to crack the password
    bcrypt.hash(password,salt,(err,hash)=>{
        console.log(hash)
    })
})

let hashedPassword = '$2a$10$sirExWsnB12v2bc.MGtRsekuleOD8yTIcLCYO9w.1xwGuratWZvhi'

// Now compare the passwords
bcrypt.compare(password,hashedPassword,(err,result)=>{
    console.log(result)
})




//***** Using JWT ********
/*let data = {
    userID :10
}*/

//create a hashed token of the data
/*const token = jwt.sign(data,'Secret Salt')
console.log(`hashed token: ${token}`)*/

// Man in the middle 
/*const verifyToken = jwt.verify(token + 1,'Secret Salt')
const verifyToken = jwt.verify(token,'Secret Salt123')
const verifyToken = jwt.verify(token,'')*/

// Decode the token
/*const verifyToken = jwt.verify(token,'Secret Salt')
console.log('verified:',verifyToken)*/


//***** Using crypto-js ******
/*const message = 'This is a message of the world'
const hash = SHA256(message).toString()
console.log(`Message : ${message}`)
console.log(`Hash : ${hash}`)

// hasing,token verifying tokens

let data={
    userID : 4
}

let token = {
    data:data,
    hash:SHA256(JSON.stringify(data) + 'Secret Salt').toString()
}


//Man in the middleCases:
token.data.userID = 5
token.hash = SHA256(JSON.stringify(token.data))

//let resultHash = SHA256(JSON.stringify(token.data)).toString()
//let resultHash = SHA256(JSON.stringify(token.data) + 'Secret Salt123').toString()

let resultHash = SHA256(JSON.stringify(token.data) + 'Secret Salt').toString()

if(resultHash === token.hash){
    console.log('Data was not manipulated')
}else{
    console.log('Data was manipulated. Not trustworthy!!!')
}*/