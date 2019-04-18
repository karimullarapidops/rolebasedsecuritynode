const express = require('express');
const bodyparser = require('body-parser');
const jwtLogin = require('jwt-login');
const roles = require('user-groups-roles');
const httpMsgs = require('http-msgs');
const model = require('./model');

const app = express();

app.listen(3000);

// roles

roles.createNewRole("admin");
roles.createNewRole("editor");
roles.createNewRole("author");
roles.createNewRole("subscriber");

// Privileges
roles.createNewPrivileges(['/article', "GET"], "This gets article", true);
roles.createNewPrivileges(['/article', "POST"], "This Insert article", false);
roles.createNewPrivileges(['/article', "PUT"], "This edit article", false);
roles.createNewPrivileges(['/article', "DELETE"], "This delete article", false);

// admin
roles.addPrivilegeToRole("admin", ['/article', "POST"], true);
roles.addPrivilegeToRole("admin", ['/article', "PUT"], true);
roles.addPrivilegeToRole("admin", ['/article', "DELETE"], true);

// editor
roles.addPrivilegeToRole("editor", ['/article', "POST"], true);
roles.addPrivilegeToRole("editor", ['/article', "PUT"], true);

// author
roles.addPrivilegeToRole("author", ['/article', "POST"], true);

// subscriber


app.use(bodyparser.urlencoded({ extended: false }));

app.get('/login', (req, res) => {
    res.sendFile(__dirname + "/html/login.html");
})

app.get('/post', (req, res) => {
    res.sendFile(__dirname + "/html/post.html");
})

app.get('/put', (req, res) => {
    res.sendFile(__dirname + "/html/put.html");
})

app.get('/delete', (req, res) => {
    res.sendFile(__dirname + "/html/delete.html");
});

app.post('/login', (req, res) => {
    try {
        let data = req.body;
        let user = data.user;
        let password = data.password;
        if (user == password) {
            jwtLogin.sign(req, res, user, "topsecret", 1, false);
        } else {
            throw "invalid login"
        } 
    } catch (error) {
        httpMsgs.send500(req, res, error);
    }
})

app.get('/logout', (req, res, error) => {
    jwtLogin.signout(req, res, false);
})

let valid_login = function(req, res, next) {
    try {
       req.jwt = jwtLogin.validate_login(req, res);
       next();
    } catch (error) {
        httpMsgs.send500(req, res, error);
    }
}

app.get('/article', valid_login, (req, res) => {
    let user = req.jwt.user;
    try {
        let role = model.getRoles(user);
        let value =  roles.getRoleRoutePrivilegeValue(role, "/article", "GET");
        if (value) {
            httpMsgs.sendJSON(req, res, {
                from: "GET"
            })
        } else {
            throw "invalid user role permission"
        }
       
    } catch (error) {
        httpMsgs.send500(req, res, error);
    }
});

app.post('/article', valid_login, (req, res) => {
    let user = req.jwt.user;
    try {
        let role = model.getRoles(user);
        let value =  roles.getRoleRoutePrivilegeValue(role, "/article", "POST");
        if (value) {
            httpMsgs.sendJSON(req, res, {
                from: "POST"
            })
        } else {
            throw "invalid user role permission"
        }
       
    } catch (error) {
        httpMsgs.send500(req, res, error);
    }
});

app.put('/article', valid_login, (req, res) => {
    let user = req.jwt.user;
    try {
        let role = model.getRoles(user);
        let value =  roles.getRoleRoutePrivilegeValue(role, "/article", "PUT");
        if (value) {
            httpMsgs.sendJSON(req, res, {
                from: "PUT"
            })
        } else {
            throw "invalid user role permission"
        }
       
    } catch (error) {
        httpMsgs.send500(req, res, error);
    }
});

app.delete('/article', valid_login, (req, res) => {
    let user = req.jwt.user;
    try {
        let role = model.getRoles(user);
        let value =  roles.getRoleRoutePrivilegeValue(role, "/article", "DELETE");
        if (value) {
            httpMsgs.sendJSON(req, res, {
                from: "DELETE"
            })
        } else {
            throw "invalid user role permission"
        }
       
    } catch (error) {
        httpMsgs.send500(req, res, error);
    }
});
