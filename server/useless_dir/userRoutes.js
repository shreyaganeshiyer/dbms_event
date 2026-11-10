const express = require('express')
const router = express.Router()

const getUser = require('./userController');
//default home page

router.get('/', (req, res) => {
    res.send('Server is running and ready!');
});

router.get('/users',getUser)


module.exports = router