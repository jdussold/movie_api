API Documentation
=================

This API provides users with access to information about different movies, directors, and genres. Users are able to register and update their personal information as well as create and edit a list of their favorite movies.

Table of Contents
-----------------

-   [Requests and Responses](#requests-and-responses)
    -   [Returns a list of ALL movies](#returns-a-list-of-all-movies)
    -   [Get data about a single movie by title](#get-data-about-a-single-movie-by-title)
    -   [Get descriptions of different genres](#get-descriptions-of-different-genres)
    -   [Get information about a film director by name](#get-information-about-a-film-director-by-name)
    -   [Register new users](#register-new-users)
    -   [Update username](#update-username)
    -   [Add movies to user favorites](#add-movies-to-user-favorites)
    -   [Remove movies from user favorites](#remove-movies-from-user-favorites)
    -   [Remove/delete users](#remove-delete-users)

Requests and Responses
----------------------

Below is a list of possible requests and responses that are possible with this API.

### Returns a list of ALL movies

Returns a JSON object containing a list of all movies.

| Request | URL | HTTP Method | Request Format | Response Format |
| --- | --- | --- | --- | --- |
| Returns a list of ALL movies | `/movies` | `GET` | URL | JSON |

### Get data about a single movie by title

Returns a JSON object containing data about a single movie specified by title.

| Request | URL | HTTP Method | Request Format | Response Format |
| --- | --- | --- | --- | --- |
| Get data about a single movie by title | `/movies/[Title]` | `GET` | URL | JSON |

Example Request URL: `/movies/Jurassic%20Park`

### Get descriptions of different genres

Returns a JSON object containing descriptions of different genres.

| Request | URL | HTTP Method | Request Format | Response Format |
| --- | --- | --- | --- | --- |
| Get descriptions of different genres | `/movies/genres/[Genre Name]` | `GET` | URL | JSON |

Example Request URL: `/movies/genres/Action`

### Get information about a film director by name

Returns a JSON object containing information about a film director specified by name.

| Request | URL | HTTP Method | Request Format | Response Format |
| --- | --- | --- | --- | --- |
| Get information about a film director by name | `/movies/directors/[Director Name]` | `GET` | URL | JSON |

Example Request URL: `/movies/directors/Peter%20Jackson`

### Register new users

Registers a new user and returns a JSON object containing the user's information.

| Request | URL | HTTP Method | Request Format | Response Format |
| --- | --- | --- | --- | --- |
| Register new users | `/users` | `POST` | Body = JSON | JSON |

Example Request Body:

`{
  "Username": "Mary",
  "Password": "abc123",
  "Email": "mary@email.com",
  "Birthday": "01/01/1981"
}`

### Update username

Updates a user's username and returns a JSON object containing the updated user's information.

| Request | URL | HTTP Method | Request Format | Response Format |
| --- | --- | --- | --- | --- |
| Update username | `/users/[Username]` | `PUT` | Body = JSON | JSON |

Example Request URL: `/users/Mary`

Example Request Body:

`{
  "Username": "NewName",
  "Password": "Upd@t3dP@ssw0rd",
  "Email": "updated@email.com",
  "Birthday": "01/01/1981"
}`

### Add movies to user favorites

Adds a movie to a user's list of favorite movies and returns a JSON object containing the updated list.

| Request | URL | HTTP Method | Request Format | Response Format |
| --- | --- | --- | --- | --- |
| Add movies to user favorites | `/users/Username/movies/[Movie_ID]` | `POST` | URL | JSON |

Example Request URL: `/users/Mary/movies/Jurassic%20Park`

### Remove movies from user favorites

Removes a movie from a user's list of favorite movies and returns a JSON object containing the updated list.

| Request | URL | HTTP Method | Request Format | Response Format |
| --- | --- | --- | --- | --- |
| Remove movies from user favorites | `/users/Username/movies/[Movie_ID]` | `DELETE` | URL | JSON |

Example Request URL: `/users/Mary/movies/Jurassic%20Park`

### Remove/delete users

Removes a user and returns a string confirmation message.

| Request | URL | HTTP Method | Request Format | Response Format |
| --- | --- | --- | --- | --- |
| Remove/delete users | `/users/[Username]` | `DELETE` | URL | String |

Example Request URL: `/users/Mary`

Styling
-------

The API documentation uses the following CSS styles:

-   The `Roboto Condensed` font from Google Fonts.
-   The `styles.css` file located in the `css` folder.

Credits
-------

This API documentation was created by John Dussold. If you have any questions or feedback, please contact me at jdussold@gmail.com.
