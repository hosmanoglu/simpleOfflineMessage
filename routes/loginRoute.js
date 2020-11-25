var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const helper = require("../helper/helper")
const sendObject=helper.sendObject;
const logErr=helper.logErr;

const db = require("../models");

router.post("/new", (req, res) => {
    db.users.create({
      name: req.body.name,
      password:req.body.pass
    }).then(user => res.send(new sendObject(true,"",user.name+" basari ile eklendi")))
    .catch(err  => {
        logErr(err)
        if (err.name=='SequelizeUniqueConstraintError') {
            res.send(new sendObject(false,"kullanıcı adı daha önceden alınmış.",{}))
        }else{
            res.send(new sendObject(false,"bir hata meydana geldi tekrar deneyin.",{}))
        }
        
    });
});

router.post('/login', function (req, res, next) {

    if (typeof (req.body.name) !== "string" || typeof (req.body.pass) !== "string") {
        res.status(400)
        res.json(new sendObject(false,"kullanıcı adı veya parola yanlış.",{}))
    } else {
        db.users.findAll({
            where: {
              name: req.body.name,
              password:req.body.pass
            }
          }).then(user=>{
                if (user.length==1 && user[0].id) {
                    let token = jwt.sign(
                        { id: user[0].id,  },
                        process.env.secret,
                        { expiresIn: "3h", },
                        
                    ); // Sigining the token
                    res.json( new sendObject(true,"",token));
                    db.loginLogs.create({
                        type:"login",
                        user_name:req.body.name
                    })
                }
                else{
                    res.status(400)
                    res.json(new sendObject(false,"kullanıcı adı veya parola yanlış.",{}))
                    db.loginLogs.create({
                        type:"invalidlogin",
                        user_name:req.body.name
                    })
                }
        }).catch((err) => {
            logErr(err)
            res.status(400)
            res.json(new sendObject(false,"kullanıcı adı veya parola yanlış.",{}))
        });
    }


});

module.exports = router;