
CREATE TABLE users (
  id serial primary key,
  username character varying(255) NOT NULL,
  password character varying(255) NOT NULL,
  image character varying(255)
);

CREATE TABLE books(
  id serial primary key,
  ISBN13 character varying(255),
  title character varying(255) ,
  category character varying(255),
  UNIQUE(title)
);

CREATE TABLE Category(
  id serial primary key,
  category character varying(255),
  UNIQUE(category)
  );


CREATE TABLE readBooks(
  id serial primary key,
  userId int REFERENCES users(id),
  bookId int REFERENCES books(id),
  rating int,
  UNIQUE(id)
);

INSERT INTO users (username, password) VALUES ('admin', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii');
