const mongoose = require('mongoose')

const connection_string = process.env.connection_string

mongoose.connect(connection_string).then(()=>{
    console.log("TODO application successfully connected to mongoDB-Atlas");
    
}).catch((err)=>{
    console.log("MongoDB Connection fails...",err);
    
})