require('dotenv').config()
const express = require("express");
const app = express();
const db = require("./models");
const jwt = require('jsonwebtoken');

const helper = require("./helper/helper")
//const sendObject=helper.sendObject;
const logErr = helper.logErr;
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const apiRoutes = require("./routes/loginRoute");
app.use("/users", apiRoutes);

app.use('/messages/', function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.secret, (err, user) => {
            if (err) {
                logErr(err)
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
})


const messageRoutes = require("./routes/messageRoute");
app.use("/messages", messageRoutes);



function testcase(isTest) {
    return new Promise(
        function (resolve, reject) {
            db.sequelize.sync({
                force: isTest
            }).then(() => {
                app.listen(PORT, () => {
                    console.log(`listening on: http://localhost:${PORT}`);
                    resolve()
                });
            });
        })
}
if (process.env.NODE_ENV != "test") {
    testcase(false)
}


module.exports = { "app": app, "sequelizeSync": testcase };