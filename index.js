/**
 * Express module.
 * @const
 */
const express = require("express"),
  app = express(),
  /**
   * Middleware module for parsing request bodies.
   * @const
   */
  bodyParser = require("body-parser"),
  /**
   * UUID module.
   * @const
   */
  uuid = require("uuid"),
  /**
   * Morgan module for logging HTTP requests.
   * @const
   */
  morgan = require("morgan"),
  /**
   * Mongoose module for MongoDB connection.
   * @const
   */
  mongoose = require("mongoose"),
  /**
   * Custom models.
   * @const
   */
  Models = require("./models.js"),
  /**
   * CORS module for handling cross-origin requests.
   * @const
   */
  cors = require("cors");

/**
 * Movie model.
 * @typedef {Object} MovieModel
 * @property {string} Title - The title of the movie.
 * @property {string} Genre - The genre of the movie.
 * ...
 */
const Movies = Models.Movie;

/**
 * User model.
 * @typedef {Object} UserModel
 * @property {string} Username - The username of the user.
 * @property {string} Email - The email of the user.
 * ...
 */
const Users = Models.User;

/**
 * Express-validator module for request validation.
 */
const { check, validationResult } = require("express-validator");

// mongoose.connect("mongodb://127.0.0.1:27017/myFlixDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

/**
 * Connection URI for MongoDB.
 * @type {string}
 */
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //bodyParser middleware function
app.use(morgan("common"));
app.use(express.static("public"));
//app.use(cors()); //allow requests from all origins

/**
 * Allowed origins for CORS.
 * @type {string[]}
 */
let allowedOrigins = [
  "https://my-flix-angular-client-rho.vercel.app",
  "http://localhost:4200",
  "http://localhost:8080",
  "http://testsite.com",
  "http://localhost:1234",
  "https://myflix-jd.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application doesn’t allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

/**
 * Authentication module.
 */
let auth = require("./auth")(app);

/**
 * Passport module for user authentication.
 */
const passport = require("passport");
require("./passport");

/**
 * Welcome route.
 * @name GET/
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/", (req, res) => {
  res.send("Welcome to MyFlix!");
});

/**
 * Get a full list of movies.
 * @name GET/movies
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
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

/**
 * Get information about a single movie by title.
 * @name GET/movies/:title
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
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

/**
 * Get information about a specific genre of film.
 * @name GET/movies/genres/:name
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
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

/**
 * Get information about a specific director.
 * @name GET/movies/directors/:name
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
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

/**
 * Get all users.
 * @name GET/users
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
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

/**
 * Get a user by username.
 * @name GET/users/:Username
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
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

    Users.findOne(query)
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
);

/**
 * Allow users to register / Create a new user.
 * @name POST/users
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
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

/**
 * Allow users to deregister / Delete a user by username.
 * @name DELETE/users/:Username
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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

/**
 * Allow users to update their user information / Update a user's info, by username.
 * @name PUT/users/:Username
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
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

/**
 * Confirm updates via password verification.
 * @name POST/verify-password
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post("/verify-password", (req, res) => {
  // Find the user with the specified username
  Users.findOne({ Username: req.body.username }, (err, user) => {
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
    // If the password is correct, set the Access-Control-Allow-Origin header and return a success message
    res.set("Access-Control-Allow-Origin", "*");
    return res.status(200).send({ success: true });
  });
});

/**
 * Get a user's favorite movies.
 * @name GET/users/:Username/favorites
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get(
  "/users/:Username/favorites",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .populate("FavoriteMovies")
      .then((user) => {
        res.json(user.FavoriteMovies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Add a movie to a user's list of favorites.
 * @name POST/users/:Username/movies/:MovieID
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * */
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
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

/**
 * Remove a movie from a user's favorites.
 * @name DELETE/users/:Username/movies/:MovieID
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
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

/**
 * Returns the API documentation.
 * @name GET/documentation
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

/**
 * Error handling middleware.
 * @function
 * @memberof module:routes
 * @inner
 * @param {Error} error - The error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - The next middleware function.
 */
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something broke!");
});

/**
 * Listen for requests.
 * @constant
 * @type {number}
 * @default
 */
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
