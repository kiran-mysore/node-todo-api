const env = process.env.NODE_ENV || 'development'

console.log('Environment is ******* : ', env)

if(env === 'development'){
    process.env.PORT = 3000
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
}else if(env === 'test'){
    process.env.PORT = 3000
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
}else if(env === 'production'){
   process.env.MONGODB_URI = 'mongodb://todouser:todouser123@ds135680.mlab.com:35680/tododb'
}