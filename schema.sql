drop table books, Category, users, readBooks;
/*
* Notendur
  - Auðkenni, _primary key_
  - Notendanafn, _einstakt gildi_, a.m.k. 3 stafir, krafist
  - Lykilorðs hash, lykilorð verður að vera a.m.k. 6 stafir, krafist
  - Nafn, ekki tómi strengurinn, krafist
  - Slóð á mynd, ekki krafist
* Flokkar
  - Auðkenni, _primary key_
  - Heiti, _einstakt gildi_, ekki tómi strengurinn, krafist
* Bækur
  - Auðkenni, _primary key_
  - Titill, _einstakt gildi_, ekki tómi strengurinn, krafist
  - ISBN13, _einstakt gildi_, nákvæmlega 13 stafa strengur gerður úr tölum, krafist
  - Höfundur, ekki krafist
  - Lýsing, lengri texti, ekki krafist
  - Flokkur, _foreign key_ í flokka töflu, krafist
  - ISBN10, strengur, ekki krafist, ekki krafa að hafa með í verkefni
  - Útgáfudagsetning, ekki krafist, strengur, ekki krafa að hafa með í verkefni
  - Síðufjöldi, tala, stærri en 0, ekki krafist, ekki krafa að hafa með í verkefni
  - Tungumál, 2 stafa strengur, ekki krafist, ekki krafa að hafa með í verkefni
* Lesnar bækur notenda
  - Auðkenni
  - Auðkenni notanda, _foreign key_ í notanda töflu, krafist
  - Auðkenni bókar, _foreign key_ í bóka töflu, krafist
  - Einkunn notanda, gildi úr eftirfarandi lista `1, 2, 3, 4, 5` þar sem `1` er lægsta einkunn og `5` hæsta, krafist
  - Dómur notanda, lengri texti, ekki krafist

*/
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
  UNIQUE(title),
  UNIQUE(ISBN13)
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
/*
*/


