const env = process.env.NODE_ENV || 'development'

console.log('Environment is ******* : ', env)


if(env === 'development' || env === 'test'){
    let config = require('./config.json')
   // console.log(config)
    let currentEnvConfig = config[env]
    //console.log(Object.keys(currentEnvConfig))
    Object.keys(currentEnvConfig).forEach((key)=>{
        process.env[key] = currentEnvConfig[key]
    })
}