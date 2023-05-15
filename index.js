const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  morgan = require("morgan"),
  mongoose = require("mongoose"),
  Models = require("./models.js"),
  cors = require("cors"),
  swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");

const Movies = Models.Movie;
const Users = Models.User;

const { check, validationResult } = require("express-validator");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API for MyFlix",
      version: "1.0.0",
      description: "A simple Express library API for MyFlix",
    },
    servers: [
      {
        url: "https://my-flix-db-jd.herokuapp.com",
      },
    ],
    tags: [
      { name: "Users", description: "Operations related to users" },
      { name: "Movies", description: "Operations related to movies" },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Movie: {
          type: "object",
          required: ["title", "description"],
          properties: {
            title: {
              type: "string",
              description: "The movie's title.",
            },
            description: {
              type: "string",
              description: "The movie's description.",
            },
          },
          example: {
            title: "The Godfather",
            description:
              "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
          },
        },
        UserInput: {
          type: "object",
          required: ["Username", "Password", "Email", "Birthday"],
          properties: {
            Username: {
              type: "string",
              description: "The user's username.",
            },
            Password: {
              type: "string",
              description: "The user's password.",
            },
            Email: {
              type: "string",
              description: "The user's email.",
            },
            Birthday: {
              type: "string",
              format: "date",
              description: "The user's birthday.",
            },
          },
          example: {
            Username: "johnDoe",
            Password: "password123",
            Email: "johndoe@example.com",
            Birthday: "2000-01-01",
          },
        },
        User: {
          type: "object",
          required: ["Username", "Email", "Birthday"],
          properties: {
            Username: {
              type: "string",
              description: "The user's username.",
            },
            Email: {
              type: "string",
              description: "The user's email.",
            },
            Birthday: {
              type: "string",
              format: "date",
              description: "The user's birthday.",
            },
          },
          example: {
            Username: "johnDoe",
            Email: "johndoe@example.com",
            Birthday: "2000-01-01",
          },
        },
        UserUpdate: {
          type: "object",
          properties: {
            Username: {
              type: "string",
              description: "The updated username.",
            },
            Password: {
              type: "string",
              description: "The updated password (optional).",
            },
            Email: {
              type: "string",
              description: "The updated email.",
            },
            Birthday: {
              type: "string",
              format: "date",
              description: "The updated birthday.",
            },
          },
          example: {
            Username: "johnDoe",
            Email: "johndoe@example.com",
            Birthday: "2000-01-01",
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            errors: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ValidationErrorItem",
              },
            },
          },
        },
        ValidationErrorItem: {
          type: "object",
          properties: {
            value: {
              type: "string",
              description: "The value that caused the validation error.",
            },
            msg: {
              type: "string",
              description: "The error message.",
            },
            param: {
              type: "string",
              description: "The parameter that caused the validation error.",
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./index.js", "./models.js", "./auth.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
//app.use(cors()); //allow requests from all origins

//allow only certain origins to be given access
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

let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

//returns a welcome message
app.get("/", (req, res) => {
  res.send("Welcome to MyFlix!");
});

// Get all movies
/**
 * @swagger
 * /movies:
 *   get:
 *     tags: [Movies]
 *     summary: Retrieve a list of movies.
 *     description: Retrieve a list of all movies in the MyFlix database.
 *     responses:
 *       200:
 *         description: A list of movies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           description: The movie's title.
 *         description:
 *           type: string
 *           description: The movie's description.
 *       example:
 *         title: The Godfather
 *         description: The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.
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

// Get information about a specific movie by title
/**
 * @swagger
 * /movies/{title}:
 *   get:
 *     tags: [Movies]
 *     summary: Retrieve information about a single movie by title.
 *     description: Retrieve information about a specific movie in the MyFlix database by its title.
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         description: The title of the movie.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Information about the movie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
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

//Get information about a specific movie genre
/**
 * @swagger
 * /movies/genres/{name}:
 *   get:
 *     tags: [Movies]
 *     summary: Retrieve information about a specific genre of film.
 *     description: Retrieve information about a specific genre of film in the MyFlix database.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: The name of the genre.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The description of the genre.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *             example:
 *               description: "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
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

// Get information about a specific director
/**
 * @swagger
 * /movies/directors/{name}:
 *   get:
 *     tags: [Movies]
 *     summary: Retrieve information about a specific director.
 *     description: Retrieve information about a specific director in the MyFlix database.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: The name of the director.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The biography of the director.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 biography:
 *                   type: string
 *             example:
 *               biography: "Peter Jackson, in full Sir Peter Robert Jackson, (born October 31, 1961, Pukerua Bay, North Island, New Zealand), New Zealand director, perhaps best known for his film adaptations of J.R.R. Tolkien's The Lord of the Rings and The Hobbit."
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

//Get all users
/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Retrieve a list of all users.
 *     description: Retrieve a list of all users in the MyFlix database.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the user.
 *         Name:
 *           type: string
 *           description: The name of the user.
 *         Password:
 *           type: string
 *           description: The password of the user.
 *         Email:
 *           type: string
 *           description: The email of the user.
 *         Birthday:
 *           type: string
 *           format: date
 *           description: The birthday of the user.
 *         Favorites:
 *           type: array
 *           items:
 *             type: string
 *           description: The list of movie IDs that the user has added to favorites.
 *       example:
 *         - _id: "636efec4bc0d2c3596dbe357"
 *           Name: "JohnDoe"
 *           Password: "p@sswOrd!"
 *           Email: "johndoe@fakeemail.com"
 *           Birthday: "2001-09-12T00:00:00.000Z"
 *           Favorites:
 *             - "636efadabc0d2c3596dbe352"
 *             - "636ef954bc0d2c3596dbe34f"
 *             - "636ef9c7bc0d2c3596dbe350"
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

//Get a user by username
/**
 * @swagger
 * /users/{Username}:
 *   get:
 *     tags: [Users]
 *     summary: Retrieve information about a user by username.
 *     description: Retrieve information about a specific user in the MyFlix database by their username.
 *     parameters:
 *       - in: path
 *         name: Username
 *         required: true
 *         description: The username of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Information about the user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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

//allow users to register / Create new user
/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user.
 *     description: Create a new user in the MyFlix database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: The newly created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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

//allow users to deregister / Delete a user by username
/**
 * @swagger
 * /users/{Username}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user by username.
 *     description: Delete a user from the MyFlix database by their username.
 *     parameters:
 *       - in: path
 *         name: Username
 *         required: true
 *         description: The username of the user to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user was deleted successfully.
 *       400:
 *         description: The specified user was not found.
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

//allow users to update their user information / Update a user's info, by username
/**
 * @swagger
 * /users/{Username}:
 *   put:
 *     tags: [Users]
 *     summary: Update a user's information by username.
 *     description: Update a user's information in the MyFlix database by their username.
 *     parameters:
 *       - in: path
 *         name: Username
 *         required: true
 *         description: The username of the user.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: The updated user's information.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       422:
 *         description: Validation errors or missing fields in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserUpdate:
 *       type: object
 *       properties:
 *         Username:
 *           type: string
 *         Password:
 *           oneOf:
 *             - type: string
 *             - type: null
 *         Email:
 *           type: string
 *         Birthday:
 *           type: string
 *           format: date
 *       required:
 *         - Username
 *         - Email
 *         - Birthday
 *       example:
 *         Username: johnDoe
 *         Password: optional
 *         Email: johndoe@example.com
 *         Birthday: 1990-01-01
 *
 *     User:
 *       type: object
 *       properties:
 *         Username:
 *           type: string
 *         Email:
 *           type: string
 *         Birthday:
 *           type: string
 *           format: date
 *       example:
 *         Username: johnDoe
 *         Email: johndoe@example.com
 *         Birthday: 1990-01-01
 *
 *     ValidationError:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *               msg:
 *                 type: string
 *               param:
 *                 type: string
 *               location:
 *                 type: string
 *       example:
 *         errors:
 *           - value: johnDoe
 *             msg: Username contains non alphanumeric characters - not allowed.
 *             param: Username
 *             location: body
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

// Confirm Updates via password verification
/**
 * @swagger
 * /verify-password:
 *   post:
 *    tags: [Users]
 *     summary: Confirm updates via password verification.
 *     description: Confirm updates to a user's information by verifying the password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordVerification'
 *     responses:
 *       200:
 *         description: Password verification successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the password verification was successful.
 *       401:
 *         description: Incorrect password.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Incorrect password.
 *       404:
 *         description: User not found.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: User not found.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PasswordVerification:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user.
 *         password:
 *           type: string
 *           description: The password for verification.
 *       required:
 *         - username
 *         - password
 *       example:
 *         username: johnDoe
 *         password: p@ssw0rd
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

// Get a user's favorite movies
/**
 * @swagger
 * /users/{Username}/favorites:
 *   get:
 *     tags: [Users]
 *     summary: Get a user's favorite movies.
 *     description: Retrieve a list of favorite movies for a specific user in the MyFlix database.
 *     parameters:
 *       - in: path
 *         name: Username
 *         required: true
 *         description: The username of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of favorite movies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       401:
 *         description: Unauthorized. User authentication failed.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: User authentication failed.
 *       404:
 *         description: User not found.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: User not found.
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

// Add a movie to a user's list of favorites
/**
 * @swagger
 * /users/{Username}/movies/{MovieID}:
 *   post:
 *     tags: [Users]
 *     summary: Add a movie to a user's list of favorites.
 *     description: Add a movie to the list of favorite movies for a specific user in the MyFlix database.
 *     parameters:
 *       - in: path
 *         name: Username
 *         required: true
 *         description: The username of the user.
 *         schema:
 *           type: string
 *       - in: path
 *         name: MovieID
 *         required: true
 *         description: The ID of the movie to add to the user's favorites.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated user with the added movie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *     components:
 *       schemas:
 *         User:
 *           type: object
 *           properties:
 *             Username:
 *               type: string
 *               description: The user's username.
 *             Email:
 *               type: string
 *               description: The user's email.
 *             Birthday:
 *               type: string
 *               format: date
 *               description: The user's birthday.
 *             FavoriteMovies:
 *               type: array
 *               items:
 *                 type: string
 *               description: The list of favorite movie IDs for the user.
 */
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

//Remove a movie from users favorites
/**
 * @swagger
 * /users/{Username}/movies/{MovieID}:
 *   delete:
 *     tags: [Users]
 *     summary: Remove a movie from a user's list of favorites.
 *     description: Remove a movie from the list of favorite movies for a specific user in the MyFlix database.
 *     parameters:
 *       - in: path
 *         name: Username
 *         required: true
 *         description: The username of the user.
 *         schema:
 *           type: string
 *       - in: path
 *         name: MovieID
 *         required: true
 *         description: The ID of the movie to remove from the user's favorites.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated user with the removed movie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *     components:
 *       schemas:
 *         User:
 *           type: object
 *           properties:
 *             Username:
 *               type: string
 *               description: The user's username.
 *             Email:
 *               type: string
 *               description: The user's email.
 *             Birthday:
 *               type: string
 *               format: date
 *               description: The user's birthday.
 *             FavoriteMovies:
 *               type: array
 *               items:
 *                 type: string
 *               description: The list of favorite movie IDs for the user.
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

//Returns the API documentation
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

// Redirect root URL to the Swagger UI documentation
app.get("/", (req, res) => {
  res.redirect("/api-docs");
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
