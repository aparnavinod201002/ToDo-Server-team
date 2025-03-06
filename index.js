require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router =require('./Router/router')
 require('./DB/connection')


const ToDoServer =express()

ToDoServer.use(cors())
ToDoServer.use(express.json())
ToDoServer.use(router)

const PORT = 3000 || process.env.PORT
ToDoServer.listen(PORT,()=>{
    console.log(`ToDo server start running at port :${PORT}`);
    
})

ToDoServer.get('/',(req,res)=>{
    res.send("ToDo server started running and waiting for the client request")
})