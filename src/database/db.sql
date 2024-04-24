CREATE DATABASE = blog_api;

CREATE TABLE articles(
    id VARCHAR(250) PRIMARY KEY,
    user_email VARCHAR(250),
    title VARCHAR(100),
    content VARCHAR(500),
    date VARCHAR(200),
    image VARCHAR(100)
);

CREATE TABLE users(
    id VARCHAR(250) PRIMARY KEY,
    name VARCHAR(250),
    lastname VARCHAR(250),
    email VARCHAR(300),
    password VARCHAR(300)
);