const express = require('express')
require('dotenv').config()


const userRouter = require('./userRoutes')

const app = express()

app.use(express.json())

// Routers connection------
app.use('/api',userRouter)
app.get('/', (req, res) => {
    res.send('Server is running successfully!');
});


const PORT = process.env.PORT || 3000

// ------- run the server
app.listen(PORT,()=>console.log(`Server running ⭐️ at port ${PORT}`))