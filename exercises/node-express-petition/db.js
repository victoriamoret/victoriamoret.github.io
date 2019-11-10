var spicedPg = require("spiced-pg");

// var db = spicedPg("postgres:postgres:pw@localhost:5432/petition");

const db = spicedPg(
    process.env.DATABASE_URL || "postgres://postgres:pw@localhost:5432/petition"
);

//define functions here, which will run in the server

//SIGNATURE TABLE
exports.addSignature = function addSignature(Signature, userID) {
    let q =
        "INSERT into signatures (Signature, userID) VALUES ($1, $2) RETURNING id"; // in case of multiple entries VALUES($1, $2, $3) ETC
    let params = [Signature, userID]; //needs to contain all args of the function, if multiple [city, country, state] etc. NEEDS TO BE AN ARRAY
    return db.query(q, params); //query() is a method of db, needs to be passed the query and the params
};

exports.showSignature = function showSignature(id) {
    let q = `SELECT Signature FROM signatures WHERE userid = $1`;
    return db.query(q, [id]);
};

//TO DO : CHECK if user already exists too
//SIGNATURES TABLE
exports.register = function register(first, last, email, password, age) {
    let q =
        "INSERT into users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id";
    let params = [first, last, email, password]; //needs to contain all args of the function, if multiple [city, country, state] etc. NEEDS TO BE AN ARRAY
    return db.query(q, params); //query() is a method of db, needs to be passed the query and the params
};

exports.addProfile = function addProfile(age, city, url, userID) {
    let q =
        "INSERT into profiles (age, city, url, userID) VALUES ($1, $2, $3, $4)";
    let params = [age, city, url, userID];
    return db.query(q, params);
};

exports.retrievePassword = function retrievePassword(email) {
    let q = "SELECT password FROM users WHERE email = $1"; //how do I return the password from the table?
    let params = [email];
    return db.query(q, params);
};

exports.retrieveID = function retrieveID(email) {
    let q = "SELECT id FROM users WHERE email = $1";
    let params = [email];
    return db.query(q, params);
};

exports.retrieveSignature = function retrieveSignature(testdeux) {
    let q = "SELECT id FROM signatures WHERE userid = $1";
    let params = [testdeux];
    return db.query(q, params);
};

exports.showSigners = function showSigners() {
    let q = `SELECT users.first AS first,
         users.last AS last, profiles.age AS age,
          profiles.city AS city,
           profiles.url AS url
            FROM signatures
            JOIN users
            ON signatures.userid = users.id
            LEFT JOIN profiles
            ON signatures.userid = profiles.userid`;
    return db.query(q, function(err, results) {
        if (!err) {
            return results;
        }
    });
};

exports.filterCities = function filterCities(city) {
    let q = `SELECT users.first AS first,
         users.last AS last, profiles.age AS age,
          profiles.city AS city,
           profiles.url AS url
            FROM signatures
            JOIN users
            ON signatures.userid = users.id
            LEFT JOIN profiles
            ON signatures.userid = profiles.userid WHERE LOWER(city) = LOWER($1)`;
    return db.query(q, [city]);
};

exports.retrieveProfile = function retrieveProfile(id) {
    let q = `SELECT users.first AS first,
         users.last AS last, profiles.age AS age,
         users.email AS email,
          profiles.city AS city,
           profiles.url AS url
            FROM profiles
            JOIN users
            ON profiles.userid = users.id
            WHERE users.id = $1`;
    return db.query(q, [id]);
};

exports.updateUser = function updateUser(id, first, last, email) {
    let q = `UPDATE users SET first = $2, email = $4, last = $3 WHERE id = $1`;
    let params = [id, first, last, email];
    return db.query(q, params);
};

exports.updateUserProfile = function updateUserProfile(id, city, age, url) {
    let q = `INSERT INTO profiles (city, age, userid, url)
VALUES ($2, $3, $1, $4)
ON CONFLICT (userid)
DO UPDATE SET city = $2, age = $3, url = $4 WHERE profiles.userid = $1`;
    let params = [id, city, age, url];
    return db.query(q, params);
};

exports.updatePassword = function updatePassword(id, password) {
    let q = `UPDATE users SET password = $2 WHERE id = $1`;
    let params = [id, password];
    return db.query(q, params);
};

exports.deleteUser = function deleteUser(id) {
    let q = `DELETE FROM users
WHERE users.id = $1`;
    let params = [id];
    return db.query(q, params);
};

exports.deleteProfile = function deleteProfile(id) {
    let q = `DELETE FROM profiles
WHERE profiles.userid = $1`;
    let params = [id];
    return db.query(q, params);
};
exports.deleteSignature = function deleteSignature(id) {
    let q = `DELETE FROM signatures
WHERE signatures.userid = $1`;
    let params = [id];
    return db.query(q, params);
};
