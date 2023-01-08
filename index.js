const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  morgan = require("morgan"),
  mongoose = require("mongoose"),
  Models = require("./models.js"),
  cors = require("cors");

const Movies = Models.Movie;
const Users = Models.User;

const { check, validationResult } = require("express-validator");

// mongoose.connect("mongodb://127.0.0.1:27017/myFlixDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //bodyParser middleware function
app.use(morgan("common"));
app.use(express.static("public"));
app.use(cors()); //allow requests from all origins

// //allow only certain origins to be given access
// let allowedOrigins = ["http://localhost:8080", "http://testsite.com"];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         // If a specific origin isn’t found on the list of allowed origins
//         let message =
//           "The CORS policy for this application doesn’t allow access from origin " +
//           origin;
//         return callback(new Error(message), false);
//       }
//       return callback(null, true);
//     },
//   })
// );

let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

//returns a welcome message
app.get("/", (req, res) => {
  res.send("Welcome to MyFlix!");
});

//Get a full list of movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(200).json(movies);
      })
      //error..
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//Get information about a single movie by title
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //res.send(`Got a GET request at /movies/title/${req.params.name}`);

    const title = req.params.title;

    // using Regular Expression (case insensitive and equal): ^the matrix$
    // const query = { 'Title': new RegExp(`^${title}$`, 'i') };
    const query = {
      Title: { $regex: new RegExp(`^${title}$`), $options: "i" },
    };

    Movies.findOne(query)
      .then((movie) => {
        res.json(movie);
      })
      .catch((error) => {
        // error..
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//Get information about a specific genre of film
app.get(
  "/movies/genres/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //res.send(`Got a GET request at /movies/genres/${req.params.name}`);

    const genreName = req.params.name;

    // using Regular Expression (case insensitive and equal): ^action$
    // const query = { 'Genre.Name': new RegExp(`^${genreName}$`, 'i') };
    const query = {
      "Genre.Name": { $regex: new RegExp(`^${genreName}$`), $options: "i" },
    };

    Movies.findOne(query)
      .then((movie) => {
        res.json(movie.Genre.Description);
      })
      .catch((error) => {
        // error..
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//Get information about a specific director
app.get(
  "/movies/directors/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //res.send(`Got a GET request at /movies/directors/${req.params.name}`);

    const directorName = req.params.name;

    // using Regular Expression (case insensitive and equal): ^peter jackson$
    // const query = { 'Director.Name': new RegExp(`^${directorName}$`, 'i') };
    const query = {
      "Director.Name": {
        $regex: new RegExp(`^${directorName}$`),
        $options: "i",
      },
    };

    Movies.findOne(query)
      .then((movie) => {
        res.json(movie.Director.Bio);
      })
      .catch((error) => {
        // error..
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//Get all users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(200).json(users);
      })
      //error..
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//Get a user by username
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //res.send(`Got a GET request at /users/Username/${req.params.name}`);

    const userName = req.params.Username;

    // using Regular Expression (case insensitive and equal): ^the matrix$
    // const query = { 'Title': new RegExp(`^${title}$`, 'i') };
    const query = {
      Username: { $regex: new RegExp(`^${userName}$`), $options: "i" },
    };

    /**
     * Problem:
     * By passing the username in the url it means anyone who has a user name can fetch anyone data.
     * This is a security problem.
     * 
     * Solution:
     * passport.authenticate("jwt", { session: false }) is a middleware that ensure the user has a valid token to reach this route.
     * How do we know the token is valid? 
     * In movie_api/passport.js  JWTStrategy takes the token decodes it, validates it and searches the database to see if this user exists and if yes
     * IT SAVES THE USER DATA IN req.user
     * 
     * Therefore you do not need to pass username in the url, you only need to reach this route with a valid token. What i am saying is this code should be:
     * 
     *  Users.findById(req.user._id)
          .populate("FavoriteMovies") // https://mongoosejs.com/docs/populate.html
          // Under the hood populate takes the ids in FavouriteMovies and checks movies to fetches the data and adds it to the response.
          .then((user) => {
              res.json(user);
            })
            //error..
            .catch((error) => {
              // error..
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
     * 
     */

    Users.findOne(query)
    .populate("FavoriteMovies") // https://mongoosejs.com/docs/populate.html
    // Under the hood populate takes the ids in FavouriteMovies and checks movies to fetches the data and adds it to the response.
    .then((user) => {
        res.json(user);
         /**
         * The code above will return:
         * {
         *    Username: "username",
              Password: "password",
              Email: "email@email.com",
              Birthday: "2022/10/20",
         *    FavoriteMovies: [
         *      {
         *           Title: "Forever young",
                    Description:"Forever young",
                    Genre: {
                      Name: "Romance",
                      Description: "Not sure",
                    },
                    Director: {
                      Name: "David A",
                      Bio: "Forever young",
                    },
                    Actors: ["Daniel A."],
                    ImagePath: "https://imgurl.com",
                    Featured: false,
         *      }
         *    ]
         * }
         */
      })
      //error..
      .catch((error) => {
        // error..
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }

 
);

//allow users to register / Create new user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            //error..
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      //error..
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//allow users to deregister / Delete a user by username
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    /**
     * Problem:
     * Anyone can delete anyones data.
     * 
     * Solution:
     * Use only token data since we know the loggedin user data is stored in req.user
     * 
     *  Users.findOneAndRemove({ _id: req.user._id })
          .then((user) => {
            if (!user) {
              res.status(400).send(req.user.Username + " was not found.");
            } else {
              res.status(200).send(req.user.Username + " was deleted.");
            }
          })
          //error..
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
     * 
     * 
     * 
     */
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found.");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      //error..
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//allow users to update their user information / Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put(
  "/users/:Username",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Create an object with the fields to update
    let updateFields = {
      Username: req.body.Username,
      Email: req.body.Email,
      Birthday: req.body.Birthday,
    };

    // Check if the password field was sent in the request body
    if (req.body.Password) {
      // If it was, rehash the password and add it to the updateFields object
      updateFields.Password = Users.hashPassword(req.body.Password);
    }

    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $set: updateFields },
      { new: true }, // This line makes sure that the updated document is returned
      //error..
      (error, updatedUser) => {
        if (error) {
          console.error(error);
          res.status(500).send("Error: " + error);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Confirm Updates via password verification
app.post("/verify-password", (req, res) => {
  // Find the user with the specified id
  Users.findById(req.user._id, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error: " + err);
    }
    if (!user) {
      return res.status(404).send("User not found");
    }
    // Use the validatePassword method to check if the entered password is correct
    let isValid = user.validatePassword(req.body.password);
    if (!isValid) {
      return res.status(401).send("Incorrect password");
    }
    // If the password is correct, return a success message
    return res.status(200).send({ success: true });
  });
});

// Add a movie to a user's list of favorites
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { _id: req.user._id }, //With this, the url can be /movies/:MovieID/addFavorites and the loggedin user can only update their record.      
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }, // This line makes sure that the updated document is returned
      //error..
      (error, updatedUser) => {
        if (error) {
          console.error(error);
          res.status(500).send("Error: " + error);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Remove a movie from users favorites
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { _id: req.user._id }, // Same as comment above
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }, // This line makes sure that the updated document is returned
      //error..
      (error, updatedUser) => {
        if (error) {
          console.error(error);
          res.status(500).send("Error: " + error);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Returns the API documentation
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

// ERROR Handling
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
