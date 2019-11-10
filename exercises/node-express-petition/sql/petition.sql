DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS users;


-- one table for user's registration
-- one table for user's signatures
-- one table for user's profile


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR(250),
    last VARCHAR(250),
    email VARCHAR(250) NOT NULL UNIQUE,
    password VARCHAR(250) NOT NULL
);

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    Signature TEXT,
    userID INTEGER NOT NULL UNIQUE
);

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    age INTEGER,
    city VARCHAR(250),
    url VARCHAR(250),
    userID INTEGER NOT NULL UNIQUE

);
