const db = require("../models");
module.exports={
    sendObject:class SendObject{ 
        constructor(success,err="",data={}){
            this.success=success
            this.err=err,
            this.data=data
        }
    },
    logErr:function logErr(err) {
        db.errors.create({
            err: JSON.stringify(err)
        })
    }
}