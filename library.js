/**
 * `/categories`
   - `GET` skilar _síðu_ af flokkum
   - `POST` býr til nýjan flokk og skilar
 * `/books`
   - `GET` skilar _síðu_ af bókum
   - `POST` býr til nýja bók ef hún er gild og skilar
 * `/books?search=query`
   - `GET` skilar _síðu_ af bókum sem uppfylla leitarskilyrði, sjá að neðan
 * `/books/:id`
   - `GET` skilar stakri bók
   - `PATCH` uppfærir bók
 * `/users/:id/read`
   - `GET` skilar _síðu_ af lesnum bókum notanda
 * `/users/me/read`
   - `GET` skilar _síðu_ af lesnum bókum innskráðs notanda
   - `POST` býr til nýjan lestur á bók og skilar
 * `/users/me/read/:id`
   - `DELETE` eyðir lestri bókar fyrir innskráðann notanda

   
 */