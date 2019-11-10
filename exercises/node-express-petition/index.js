const express = require("express");
const app = express();
const db = require("./db");
const csurf = require("csurf");
const bc = require("./config/bc.js");
var hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");
//REQUIRE REDIS FILE!!!

//COOKIE SESSION

const cookieSession = require("cookie-session");

app.use(
    cookieSession({
        secret: "None",
        maxAge: 1000 * 60 * 24 * 14
    })
);

//END COOKIE SESSION

app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);

app.use(csurf());
app.use(function(req, res, next) {
    res.setHeader("x-frame-options", "DENY");
    res.locals.csrfToken = req.csrfToken();
    next();
});
// app.use(function(req, res, next) {
//     if (!req.session.userID && req.url != "/register" && req.url != "/login") {
//         return res.redirect("/register");
//     }
//     next();
// });
//
// function requireLoggedOutUser(req, res, next) {
//     if (req.session.userID) {
//         return res.redirect("/petition");
//     }
//     next();
// }

//HOW TO USE IT:

// app.get("/route", requireLoggedOutUser (req, res, next) => {
//
//     //whatever
// }
function isMobileDevice() {
    return (
        typeof window.orientation !== "undefined" ||
        navigator.userAgent.indexOf("IEMobile") !== -1
    );
}
app.get("/", (req, res) => {
    res.redirect("/petition");
});

app.get("/petition", (req, res) => {
    if (req.session.signatureID) {
        //if there is the cookie for sigID > redirect thank you, cannot sign again
        res.redirect("/thankyou");
    } else if (!req.session.userID) {
        //if not signed, redirect to register
        res.redirect("/register");
    } else {
        //if logged in BUT not signed :
        res.render("homepage", {
            layout: "main",
            style: "petitionthankyou.css",
            mobile: "Using a mobile or touch device? Please click HERE to sign",
            mobilelink: "/petition-mobile"
        });
    }
    // }
});

app.get("/petition-mobile", (req, res) => {
    res.render("homepage", {
        layout: "mobile",
        style: "petitionthankyou.css"
    });
});
app.post("/petition-mobile", (req, res) => {
    db.addSignature(req.body.signatureimg, req.session.userID)
        .then(id => {
            req.session.signatureID = id.rows[0].id;
            // .THEN(()=>{}) BECAUSE DB app PROMISIFIES EVERYTHING!
            res.redirect("/thankyou");
        })
        .catch(err => {
            console.log("err in addSignature :", err);
        });
});

app.post("/petition", (req, res) => {
    db.addSignature(req.body.signatureimg, req.session.userID)
        .then(id => {
            req.session.signatureID = id.rows[0].id;
            // .THEN(()=>{}) BECAUSE DB app PROMISIFIES EVERYTHING!
            res.redirect("/thankyou");
        })
        .catch(err => {
            console.log("err in addSignature :", err);
        });
});

app.get("/thankyou", (req, res) => {
    console.log("REQSESSSION ID", req.session.signatureID);
    let test = req.session.userID;
    db.showSignature(test)
        .then(results => {
            console.log("TEST ", results);

            let image = results.rows[0].signature;

            res.render("thankyou", {
                layout: "main",
                style: "petitionthankyou.css",
                image: image
            });
        })
        .catch(err => {
            console.log("err in showSignature ", err);
            res.redirect("/petition");
        });
});

app.get("/register", (req, res) => {
    res.render("register", {
        layout: "register",
        style: "homepage.css"
    });
});

app.post("/register", (req, res) => {
    if (
        !req.body.first ||
        !req.body.last ||
        !req.body.email ||
        !req.body.password
    ) {
        res.render("registerfailed", {
            layout: "register",
            style: "homepage.css"
        });
    } else {
        // db.checkExistingUser(req.body.email).then(email => {
        //     console.log("email");
        // }); //err code 23505 if email duplicate key violattion. property of err code.

        bc.hashPassword(req.body.password)
            .then(hash => {
                db.register(
                    req.body.first,
                    req.body.last,
                    req.body.email,
                    hash,
                    req.body.age
                )
                    .then(id => {
                        req.session.userID = id.rows[0].id;
                        console.log(id.rows[0].id);
                        db.addProfile(null, "", "", req.session.userID);
                    })
                    .then(whatever => {
                        res.redirect("/profile");
                    });
            })
            .catch(err => {
                console.log("err in registering user ", err);
            });
    }
});

app.get("/login", (req, res) => {
    res.render("login", {
        layout: "login",
        style: "homepage.css"
    });
});

app.post("/login", (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.render("loginfailed", {
            layout: "login",
            style: "homepage.css",
            incomplete: "You have not filled all the required fields, sorry!"
        });
    } else {
        db.retrievePassword(req.body.email)
            .then(results => {
                bc.checkPassword(
                    req.body.password,
                    results.rows[0].password
                ).then(boolean => {
                    if (!boolean) {
                        res.render("loginfailed", {
                            layout: "login",
                            style: "homepage.css"
                        });
                    } else {
                        db.retrieveID(req.body.email)
                            .then(id => {
                                req.session.userID = id.rows[0].id;
                            })
                            .catch(err => {
                                console.log(err);
                            })
                            .then(results => {
                                db.retrieveSignature(req.session.userID)
                                    .then(object => {
                                        req.session.signatureID =
                                            object.rows[0].id;
                                        res.redirect("/thankyou");
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.redirect("/petition");
                                    });
                            })
                            .catch(err => {
                                console.log(
                                    "err in then results before signature",
                                    err
                                );
                            });
                    }
                });
            })
            .catch(err => {
                res.render("loginfailed", {
                    layout: "login",
                    style: "homepage.css"
                });
            });
    }
});

app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main",
        style: "homepage.css"
    });
    //in case user escapes profile, will,create a row for it anyways
    //after register
});

//THIS FUNCTION I DID NOT WRITE MYSELF, I FOUND IT ON "https://stackoverflow.com/questions/3543187/prepending-http-to-a-url-that-doesnt-already-contain-http". But I do understand it :)

function formatUrl(url) {
    var httpString = "http://";
    var httpsString = "https://";

    if (
        url == "" ||
        url.substr(0, httpString.length).toLowerCase() == httpString ||
        url.substr(0, httpsString.length).toLowerCase() == httpsString
    ) {
        return url;
    } else if (
        url.substr(0, httpString.length).toLowerCase() !== httpString &&
        url.substr(0, httpsString.length).toLowerCase() !== httpsString
    ) {
        url = httpString + url;
        return url;
    }
}

app.post("/profile", (req, res) => {
    db.updateUserProfile(
        req.session.userID,
        req.body.city,
        req.body.age || null,
        formatUrl(req.body.url)
    );
    res.redirect("/petition");
    //when they post the info in profile
});

app.get("/signers", (req, res) => {
    if (req.session.signatureID) {
        //if there is the cookie for sigID > redirect thank you, cannot sign again
        db.showSigners()
            .then(whatever => {
                res.render("signers", {
                    layout: "signers",
                    style: "signers.css",
                    list: whatever.rows
                });
                console.log("AFTER RENDER!");
            })
            .catch(err => {
                console.log("err in showSigners ", err);
            });
    } else {
        //if not signed, redirect to register
        res.render("signers", {
            layout: "signers",
            style: "signers.css",
            notsigned:
                "In order to see the signers, you must sign the petition first, to do so, please click here",
            petition: "/petition"
        });
        //render "you cannot see the signers before you have signed yourself'
    }
});

app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main",
        style: "homepage.css"
    });
    //after register
});

app.post("/profile", (req, res) => {
    let newUrl = formatUrl(req.body.url);
    db.addProfile(req.body.age, req.body.city, newUrl, req.session.userID);
    res.redirect("/petition");
    //when they post the info in profile
});

app.get("/signers", (req, res) => {
    if (!req.session.signatureID) {
        db.showSigners()
            .then(whatever => {
                console.log("OBJECT!", whatever.rows[0].city); //gets the city out.

                res.render("signers", {
                    layout: "signers",
                    style: "homepage.css",
                    list: whatever.rows
                });
                console.log("AFTER RENDER!");
            })
            .catch(err => {
                console.log("err in showSigners ", err);
            });
    } else {
        res.redirect("/petition");
    }
});

app.get("/signers/:city", (req, res) => {
    let city = req.params.city;
    db.filterCities(city)
        .then(results =>
            res.render("signers", {
                layout: "signers",
                style: "homepage.css",
                list: results.rows,
                city: city
            })
        )
        .catch(err => {
            console.log("err in city filter ", err);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    //FOR REDIS COOKIES :
    // req.session.destroy(function() {   ITS ASYNCHRONOUS > CALLBACK!!
    //     res.redirect("/register");
    // })
    res.redirect("/register");
});

app.get("/edit", (req, res) => {
    db.retrieveProfile(req.session.userID)
        .then(results => {
            console.log(results, "RESULTS!");
            res.render("edit", {
                layout: "edit",
                style: "homepage.css",
                first: results.rows[0].first,
                last: results.rows[0].last,
                email: results.rows[0].email,
                age: results.rows[0].age,
                city: results.rows[0].city,
                url: results.rows[0].url
            });
        })
        .catch(err => {
            console.log("error in /edit route", err); //if someone goes to edit before validating profile form > must redirect to the PETITION
            res.redirect("/petition");
        });
});

app.post("/edit", (req, res) => {
    //FIX THE EMAIL EMPTY ISSUE
    if (req.body.password != "") {
        bc.hashPassword(req.body.password).then(hash => {
            db.updatePassword(req.session.userID, hash).catch(err => {
                console.log(err);
            });
        });
    }
    db.updateUser(
        req.session.userID,
        req.body.first,
        req.body.last,
        req.body.email
    )

        .catch(err => {
            console.log(err);
        })
        .then(() => {
            return db.updateUserProfile(
                req.session.userID,
                req.body.city,
                req.body.age,
                formatUrl(req.body.url)
            );
        })
        .catch(err => {
            console.log(err);
        })
        .then(() => {
            db.retrieveProfile(req.session.userID)
                .then(results => {
                    res.render("edit", {
                        layout: "edit",
                        style: "homepage.css",
                        edit: "Information successfully updated",
                        first: results.rows[0].first,
                        last: results.rows[0].last,
                        email: results.rows[0].email,
                        age: results.rows[0].age,
                        city: results.rows[0].city,
                        url: results.rows[0].url
                    });
                })
                .catch(err => {
                    console.log("err in update details ", err);
                });
        })
        .catch(err => {
            console.log("error in edit ", err);
        })
        .catch(err => {
            console.log("error in edituser ", err);
        });
});

app.get("/delete-account", (req, res) => {
    res.render("delete", {
        layout: "edit",
        message: "Click here to fully delete your account :",
        thingtodelete: "account",
        style: "homepage.css"
    });
});
app.post("/delete-account", (req, res) => {
    db.deleteSignature(req.session.userID)
        .then(id => {
            db.deleteProfile(req.session.userID);
        })
        .then(id => {
            db.deleteUser(req.session.userID);
        })
        .then(id => {
            res.redirect("/logout");
        });
});

app.get("/delete-signature", (req, res) => {
    db.showSignature(req.session.userID).then(results => {
        let image = results.rows[0].signature;
        res.render("delete", {
            layout: "edit",
            message: "Click here to delete your signature :",
            thingtodelete: "signature",
            style: "homepage.css",
            img: image
        });
    });
});

app.post("/delete-signature", (req, res) => {
    db.deleteSignature(req.session.userID)
        .then(results => {
            delete req.session.signatureID;
            res.render("delete", {
                layout: "edit",
                message: "You have deleted your signature!",
                thingtodelete: "signature",
                style: "homepage.css"
            });
        })
        .catch(err => {
            res.redirect("/logout");
        });
});

app.use(express.static(__dirname + "/public"));

app.listen(process.env.PORT || 8080, function() {
    console.log("Petition switched ON!");
});
