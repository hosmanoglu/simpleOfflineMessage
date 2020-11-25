var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const helper = require("../helper/helper")
const sendObject=helper.sendObject;
const logErr=helper.logErr;
const db = require("../models");


router.get("/getInbox", (req, res) => {
    db.inbox.findAll({
        where:{
            target_user_id:req.user.id
        } 
    }).then(messages => res.send( new sendObject(true,"",messages)))
    .catch(err => {
        logErr(err)
        res.send(new sendObject(false,"bir hata meydana geldi tekrar deneyin",{}))
    });
});

router.get("/getOutbox", (req, res) => {
    db.outbox.findAll({
        where:{
            from_user_id:req.user.id
        } 
    }).then(messages => res.send(new sendObject(true,"",messages)))
    .catch(err => {
        logErr(err)
        res.send(new sendObject(false,"bir hata meydana geldi tekrar deneyin",{}))
    });
});

router.get("/getLoginLogs", (req, res) => {
    db.users.findAll({
        where:{
            id:req.user.id
        } 
    }).then(users => {
        db.loginLogs.findAll({
            where:{
                user_name:users[0].name
            } 
        }).then(logs => {
            res.send(new sendObject(true,"",logs))
        }).catch(err =>  {
            logErr(err)
            res.send(new sendObject(false,"bir hata meydana geldi tekrar deneyin",{}))
        });
    })
    .catch(err =>  {
        logErr(err)
        res.send(new sendObject(false,"bir hata meydana geldi tekrar deneyin",{}))
    });
});

router.get("/getBloked", (req, res) => {
    db.bloked.findAll({
        attributes: ["bloked_id"],
        where:{
            user_id:req.user.id
        } 
    }).then(blok => {
        db.users.findAll({
            attributes: ["name"],
            where:{
                id:blok
            } 
        }).then(bloked_names => {
            res.send(new sendObject(true,"",bloked_names))
        }).catch(err => {
            logErr(err)
            res.send(new sendObject(false,"bir hata meydana geldi tekrar deneyin",{}))
        });

    })
    .catch(err => {
        logErr(err)
        res.send(new sendObject(false,"bir hata meydana geldi tekrar deneyin",{}))
    });
});

router.post("/newMessage", (req, res) => {
    db.users.findAll({
        where: {
            name: req.body.targetUser
        }
    }).then(targetUser => {
        if (targetUser.length == 1 && targetUser[0].id) {
            db.bloked.findAll({
                where: {
                    user_id: targetUser[0].id,
                    bloked_id: req.user.id,
                }
            }).then(blok => {
                if (blok.length > 0) {
                    res.send(new sendObject(false,"",req.body.targetUser + " sizi engellemiş"));
                } else {
                    db.inbox.create({
                        target_user_id: targetUser[0].id,
                        from_user_id: req.user.id,
                        message: req.body.message
                    }).then(user => res.send(new sendObject(true,"","mesaj başarı ile gönderildi")))
                        .catch(err =>  {
                            logErr(err)
                            res.send(new sendObject(false,"bir hata meydana geldi tekrar deneyin",{}))
                        });
                    db.outbox.create({
                        from_user_id: req.user.id,
                        target_user_id: targetUser[0].id,
                        message: req.body.message
                    })
                        .catch(err =>  {
                            logErr(err)
                            res.send(new sendObject(false,"bir hata meydana geldi tekrar deneyin",{}))
                        });
                }
            })
        } else {
            res.status(400)
            res.json(new sendObject(false,"kullanıcı adı yanlış",{}))
        }
    }).catch(err => {
        logErr(err)
        res.send(new sendObject(false,"kullanıcı adı yanlış",{}))})
});

router.post("/newBloked", async (req, res) => {
    db.users.findAll({
        where: {
            name: req.body.targetUser
        }
    }).then(targetUser => {
        if (targetUser.length == 1 && targetUser[0].id) {
            db.bloked.create({
                user_id: req.user.id,
                bloked_id: targetUser[0].id,
            }).then(user => res.send(new sendObject(true,"",targetUser[0].name+" engellendi")))
                .catch(err =>  {
                    logErr(err)
                    res.send(new sendObject(false,"bir hata meydana geldi tekrar deneyin",{}))
                });
            
        } else {
            res.status(400)
            res.json(new sendObject(false,"kullanıcı adı yanlış",{}))
        }
    }).catch(err  => {
        logErr(err)
        res.send(new sendObject(false,"kullanıcı adı yanlış",{}))})
});


router.post("/removeBloked", async (req, res) => {
    db.users.findAll({
        where: {
            name: req.body.targetUser
        }
    }).then(targetUser => {
        if (targetUser.length == 1 && targetUser[0].id) {
            db.bloked.destroy({
                user_id: req.user.id,
                bloked_id: targetUser[0].id,
            }).then(user => res.send(new sendObject(true,"",targetUser[0].name+" engeli kalktı")))
                .catch(err =>  {
                    logErr(err)
                    res.send(new sendObject(false,"bir hata meydana geldi tekrar deneyin",{}))
                });
            
        } else {
            res.status(400)
            res.json(new sendObject(false,"kullanıcı adı yanlış",{}))
        }
    }).catch(err  => {
        logErr(err)
        res.send(new sendObject(false,"kullanıcı adı yanlış",{}))})
});



module.exports = router;