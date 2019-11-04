var express = require("express");
var app = express();

var basicAuth = require("basic-auth");

//cookie parser should be here (BEFORE because we use it below)

var auth = function(req, res, next) {
    var creds = basicAuth(req);
    if (!creds || creds.name != "discoduck" || creds.pass != "sesame1") {
        res.setHeader(
            "WWW-Authenticate",
            'Basic realm="Enter your credentials to see this stuff."'
        );
        res.sendStatus(401);
    } else {
        next();
    }
};

// app.use(auth); needed, but in case we want to allow some parts of the website, we'll add it on the app.get or else

app.get("/", (req, res) => {
    res.send("<h1>Hi Tabasco!</h1"); //send or end, does not matter
});

app.get("/about", auth, (req, res) => {
    // IMPORTANT : we added 'auth' so the page is only viewable with login
    res.send("<h1>This is the About page!</h1");
});

app.listen(8080, () => console.log("Listening!!! :)"));
