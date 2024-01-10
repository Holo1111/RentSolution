const express = require('express')
const app = express()

app.get('/',(req,res)=>{
    res.send("Welcome to the server of shit")
})

app.post('/update',(req,res)=>{
    res.send("Welcome to the server of shitass")
})

app.listen(4000,()=>{
    console.log("Connected to the server")

})