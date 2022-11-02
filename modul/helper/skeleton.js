module.exports = {
    email : function(subject,body){
        let dataOptions = {
            from : 'support@egogohub.com',
            to : 'it.log.egogohub@gmail.com',
            subject : subject,
            html : body
        }
        return dataOptions
    }
}