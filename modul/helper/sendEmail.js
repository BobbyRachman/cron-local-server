let transporter = require('../helper/transporter');

module.exports = (mailOptions)=>{
    return new Promise((resolve,reject)=>{
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error) return reject(error);
            resolve(info);
        })
    })
}