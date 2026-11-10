const db = require('./db')

getUser = (req,res)=>{
    const sql = 'select * from customers'
    db.query(sql,(err,results)=>{
    if(err){
        return res.status(500).json({msg:'doomed'});
    }
    res.status(200).json(results);
    })
}

module.exports = getUser