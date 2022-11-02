var con = require('../../config/db')

// param sql = query sql

module.exports = (sql,data) =>{
    return new Promise((resolve,reject) =>{
        con.getConnection((err,tempConn)=>{
            if(err){
                // tempConn.release();
                return reject(err);
            } else {
                tempConn.query(sql,data,(err,row)=>{
                    tempConn.release();
                    if(err) return reject(err);
                    resolve(row);
                })
            }
        })
    })
}
