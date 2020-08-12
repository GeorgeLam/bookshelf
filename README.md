This project was created using vanilla Javascript along with Bootstrap. It uses the Google Books API to search for book information, and Firebase for authentication and as a database upon which users' chosen books are saved.

A user must first create an account or log in to save books. Upon logging in, books saved on the database are transferred to local storage. This allows for prevention of duplicate saves (checked on the client-side). Once logged in, users can save, rate and review books.

The saved books page then displays books that are in local storage and allows users to edit their ratings and reviews.

Upon logging out, the saved books are removed from local storage. Upon saving/deleting books, the object in local storage is updated, and then sent to the database.