const express = require('express')
require('dotenv').config()
const cors = require('cors')

const userRouter = require('./routes/userRoutes')

const app = express()
app.use(cors())
app.use(express.json())

// Routers connection------
app.use('/api',userRouter)
app.get('/', (req, res) => {
    res.send('Server is running successfully!');
});


const PORT = process.env.PORT || 3000

// ------- run the server
app.listen(PORT,()=>console.log(`Server running ⭐️ at port ${PORT}`))