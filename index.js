require('dotenv').config
const express = require('express')
const cors = require('cors')



const ToDoServer =express()

ToDoServer.use(cors())

const PORT = 3000 || process.env.PORT
ToDoServer.listen(PORT,()=>{
    console.log(`ToDo server start running at port :${PORT}`);
    
})

ToDoServer.get('/',(req,res)=>{
    res.send("ToDo server started running and waiting for the client request")
})