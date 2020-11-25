
process.env.NODE_ENV = "test"
const db = require("../models");

var server = require("../main").app;

const chai = require("chai");
const chaiHttp = require("chai-http");

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);



var user1 = { "name": "1.user", "pass": "xxx", "token": "" }
var user2 = { "name": "2.user", "pass": "xxx", "token": "" }

describe("all", () => {
    
    it("create", async () => {
        
        await require("../main").sequelizeSync(true)
        let c1 = chai.request(server)
            .post("/users/new")
            .set('content-type', 'application/json')
            .send(JSON.stringify(user1))
        
        let c2 = chai.request(server)
            .post("/users/new")
            .set('content-type', 'application/json')
            .send(JSON.stringify(user2))
     
        c1 = await c1
        c2 = await c2
        c1.should.have.status(200);
        c1.body.should.be.a("object");
        c1.body.should.satisfy(function (body) {
            if (body.data === user1.name + " basari ile eklendi")  {
                return true;
            }else if (body.err=== "kullanıcı adı daha önceden alınmış."){
                return true;
            } 
            else {
                return false;
            }
        });

        c2.should.have.status(200);
        c2.body.should.be.a("object");
        c2.body.should.satisfy(function (body) {
            if (body.data === user2.name + " basari ile eklendi")  {
                return true;
            }else if (body.err=== "kullanıcı adı daha önceden alınmış."){
                return true;
            } 
            else {
                return false;
            }
        });
        let u1 = chai.request(server)
            .post("/users/login")
            .set('content-type', 'application/json')
            .send(JSON.stringify(user1))

        let u2 = chai.request(server)
            .post("/users/login")
            .set('content-type', 'application/json')
            .send(JSON.stringify(user2))

        u1 = await u1
        u2 = await u2
        u1.should.have.status(200);
        u1.body.should.be.a("object");
        u1.body.should.have.property("data")

        u2.should.have.status(200);
        u2.body.should.be.a("object");
        u2.body.should.have.property("data")
        user1.token = u1.body.data
        user2.token = u2.body.data

        console.log("send 1 to 2")
        let newMessage = await chai.request(server)
            .post("/messages/newMessage")
            .set('content-type', 'application/json')
            .set("authorization", "bearer " + user1.token)
            .send(JSON.stringify({ "targetUser": "2.user", "message": "xxa" }))

        newMessage.should.have.status(200);
        newMessage.body.should.be.a("object");
        newMessage.body.data.should.eql("mesaj başarı ile gönderildi");

        console.log("1 outbox")
        let outbox = await chai.request(server)
            .get("/messages/getOutbox")
            .set('content-type', 'application/json')
            .set("authorization", "bearer " + user1.token)

        outbox.should.have.status(200);
        outbox.body.should.be.a("object");
        expect(outbox.body.data).to.have.lengthOf.above(0);

        console.log("2 inbox")
        let inbox = await chai.request(server)
            .get("/messages/getInbox")
            .set('content-type', 'application/json')
            .set("authorization", "bearer " + user2.token)

        inbox.should.have.status(200);
        inbox.body.should.be.a("object");
        expect(inbox.body.data).to.have.lengthOf.above(0);


        console.log("bloke 2")
        let newBloked = await chai.request(server)
            .post("/messages/newBloked")
            .set('content-type', 'application/json')
            .set("authorization", "bearer " + user1.token)
            .send(JSON.stringify({ "targetUser": user2.name }))

        newBloked.should.have.status(200);
        newBloked.body.should.be.a("object");
        newBloked.body.data.should.eql(user2.name + " engellendi");



        console.log("2to1")
        newMessage = await chai.request(server)
            .post("/messages/newMessage")
            .set('content-type', 'application/json')
            .set("authorization", "bearer " + user2.token)
            .send(JSON.stringify({ "targetUser": "1.user", "message": "xxa" }))

        newMessage.should.have.status(200);
        newMessage.body.should.be.a("object");
        newMessage.body.data.should.eql(user1.name + " sizi engellemiş");



        console.log("1 getLoginLogs")
        let getLoginLogs = await chai.request(server)
            .get("/messages/getLoginLogs")
            .set('content-type', 'application/json')
            .set("authorization", "bearer " + user1.token)

        getLoginLogs.should.have.status(200);
        getLoginLogs.body.should.be.a("object");
        expect(getLoginLogs.body.data).to.have.lengthOf.above(0);



    })
    //         })
    // })
    // beforeEach("logins", async () => {


    // })


    // describe("create login", () => {

    //     it("login1", done => {
    //         //this.timeout(50000000);
    //         console.log("login")
    //         chai.request(server)
    //             .post("/users/login")
    //             .set('content-type', 'application/json')
    //             .send(JSON.stringify(user1))
    //             .end((error, response) => {
    //                 user1.token = response.body.data
    //                 done()
    //             })
    //     });

    //     before("create", done => {
    //         chai.request(server)
    //             .post("/users/new")
    //             .set('content-type', 'application/json')
    //             .send(JSON.stringify(user2))
    //             .end((error, response) => {
    //                 response.should.have.status(200);
    //                 response.body.should.be.a("object");
    //                 done()
    //             })

    //         //done();
    //     });

    //     it("login2", done => {
    //         //this.timeout(50000000);
    //         console.log("login")
    //         chai.request(server)
    //             .post("/users/login")
    //             .set('content-type', 'application/json')
    //             .send(JSON.stringify(user2))
    //             .end((error, response) => {
    //                 user2.token = response.body.data
    //                 done()
    //             })
    //     });

    // });

    //describe("send message", () => {
    //this.timeout(500);
    // it("send 1to2", done => {
    //     chai.request(server)
    //         .post("/messages/newMessage")
    //         .set('content-type', 'application/json')
    //         .set("authorization", "bearer " + user1.token)
    //         .send(JSON.stringify({ "targetUser": "2.user", "message": "xxa" }))
    //         .end((error, response) => {
    //             response.should.have.status(200);
    //             response.body.should.be.a("object");
    //             response.body.data.should.eql("mesaj başarı ile gönderildi");
    //             done();
    //         });
    // });

    //});

    //describe("check inbox out box", () => {
    //this.timeout(500);
    // it("1 outbox", done => {
    //     chai.request(server)
    //         .get("/messages/getOutbox")
    //         .set('content-type', 'application/json')
    //         .set("authorization", "bearer " + user1.token)
    //         .end((error, response) => {
    //             response.should.have.status(200);
    //             response.body.should.be.a("object");
    //             expect(response.body.data).to.have.lengthOf.above(0);
    //             done();
    //         });
    // });

    //});

    //describe("check inbox out box", () => {
    //this.timeout(500);
    // it("2 inbox", done => {
    //     chai.request(server)
    //         .get("/messages/getInbox")
    //         .set('content-type', 'application/json')
    //         .set("authorization", "bearer " + user2.token)
    //         .end((error, response) => {
    //             response.should.have.status(200);
    //             response.body.should.be.a("object");
    //             expect(response.body.data).to.have.lengthOf.above(0);
    //             done();
    //         });
    // });

    // });

    // describe("bloke 2", () => {
    //this.timeout(500);
    // it("bloke 2", done => {
    //     chai.request(server)
    //         .post("/messages/newBloked")
    //         .set('content-type', 'application/json')
    //         .set("authorization", "bearer " + user1.token)
    //         .send(JSON.stringify({ "targetUser": user2.name }))
    //         .end((error, response) => {
    //             response.should.have.status(200);
    //             response.body.should.be.a("object");
    //             response.body.data.should.eql(user2.name + " engellendi");
    //             done();
    //         });
    // });
    // });
    // describe("try message 2to1", () => {
    //this.timeout(500);
    // it("2to1", done => {
    //     chai.request(server)
    //         .post("/messages/newMessage")
    //         .set('content-type', 'application/json')
    //         .set("authorization", "bearer " + user2.token)
    //         .send(JSON.stringify({ "targetUser": "1.user", "message": "xxa" }))
    //         .end((error, response) => {
    //             response.should.have.status(200);
    //             response.body.should.be.a("object");
    //             response.body.data.should.eql(user1.name + " sizi engellemiş");
    //             done();
    //         });
    // });
    // });

    //  describe("gel logs", () => {
    //this.timeout(500);
    // it("1 getLoginLogs", done => {
    //     chai.request(server)
    //         .get("/messages/getLoginLogs")
    //         .set('content-type', 'application/json')
    //         .set("authorization", "bearer " + user1.token)
    //         .end((error, response) => {
    //             response.should.have.status(200);
    //             response.body.should.be.a("object");
    //             expect(response.body.data).to.have.lengthOf.above(0);
    //             done();
    //         });
    // });

    //});
})





