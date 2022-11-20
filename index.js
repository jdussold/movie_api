const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  morgan = require("morgan"),
  mongoose = require("mongoose"),
  Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect("mongodb://127.0.0.1:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //bodyParser middleware function
app.use(morgan("common"));
app.use(express.static("public"));

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
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
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
      .catch((err) => {
        // error..
        console.error(err);
        res.status(500).send("Error: " + err);
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
      .catch((err) => {
        // error..
        console.error(err);
        res.status(500).send("Error: " + err);
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
      .catch((err) => {
        // error..
        console.error(err);
        res.status(500).send("Error: " + err);
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
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
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

    Users.findOne(query)
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        // error..
        console.error(err);
        res.status(500).send("Error: " + err);
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
app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//allow users to deregister / Delete a user by username
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
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
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
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Add a movie to a user's list of favorites
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
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
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
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
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
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log("listening on port 8080");
});
