# Hópverkefni

## Uphafstilling 
* npm install
* Til þess að upphafstilla gagnagrunninn þá skal keyra createdb.js
* node createdb.js
* Eftir: Gögn  hafa verið lesin inn. Einn user admin með password 123 
* hefur verið bætt í notenda töflu.

### Töflur í gagnagrunni
* users
* books
* Category
* readBooks

### Keirsla
* Fyrir:
* node app.js
* Eftir: app keyrir á localhost:4000

### Notkun

#### /register
* Notkun: Post
* Fyrir: jason, username >= 3, password >= 6, ekkert bil í password,
* og notandi má ekki vera þegar til.
* {
*   "username": "foo",
* 	"password": "fofoso"
* }
* Eftir: Nýr notandi hefur verið skráður og skilað {"username":"foo"}

#### /login
* Notkun: Post
* Fyrir: username, password
* {
*   "username": "admin",
* 	"password": "123"
* }
* Skilar token {"token": "xxx"}

#### /users
* Notkun: Get
* Skilar síðu af skráðum notendum

#### /users/1
* Notkun: Get
* Skilar {"id":"1","username":"admin"}

#### /users/me
* Notkun: Get
* Skilar: Innsrkáðum notenda {"id":"1","username":"admin"}
* Notkun: Patch ekki útfært

#### /users/me/profile
* Notkun: Post ekki útfært

#### /categories
* Notkun: Get
* Skilar: Öllum bókaflokkum
* Notkun: Post
* Fyrir: Flokkur má ekki vera þegar til
* {
*   "category": "foo"
* }
* Eftir: Flokki foo hefur verið bætt við

#### /books
* Notkun: Get
* Skilar: Öllum bókum
* Notkun: Post
* Fyrir: titill >= 1, isbn13 = 13, titill og isbn13 meiga ekki vera þegar til 
* {
*    "isbn13": "1212121212121",
*    "title": "me",
*    "category": "admn"
* }

#### /books?search=query
* Notkun: Get
* Eftir: Bækur sem upfylla leitarskilyrði

#### /books/:id
* Notkun: Get
* Eftir: Skilar stakri bók
* Notkun: Patch
* Fyrir: titill >= 1, isbn13 = 13, titill og isbn13 meiga ekki vera þegar til
* {
*    "isbn13": "1212121212121",
*    "title": "me",
*    "category": "Fiction"
* }

#### /users/:id/read
* Notkun: Get
* Eftir: Síða af lesnum bókum notanda

#### /users/me/read
* Notkun: Get
* Eftir: Skilar síðum af lesnum bókum innskráðs notenda
* Notkun: Post
* Fyrir: 0 < rating <= 5
* {
*    "bookId": "1",
*    "rating": "1"
* }
* Eftir: Búið að er bæta við nýjum lestti á notendan

#### /users/me/read/:id
* Notkun: Delete
* Eftir: Búið er að eyða lesna bók með gefnu id

