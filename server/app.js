const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const userRouter = require('./router/userRouter')
const playerRouter = require('./router/playerRouter')

app.use(cors())
app.use(bodyParser.json(),bodyParser.urlencoded({ extended: false }))
app.use('/auth',userRouter)
app.use('/player',playerRouter)

mongoose.connect(`mongodb+srv://coolsourav100:Sourav1234ss@cluster1.syv6z7h.mongodb.net/3devn?retryWrites=true&w=majority`).then(()=>{

  app.listen(4000,()=>{
    console.log('server running on 4000 and DB connected')
  })
}).catch(err=>{
  console.log('server not responding ...')
})