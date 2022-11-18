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

/* let users = [
  {
    id: 1,
    name: "John",
    favoriteMovies: [],
  },
  {
    id: 2,
    name: "Jacob",
    favoriteMovies: ["The Lord of the Rings: The Fellowship of the Ring"],
  },
]; */

/* let movies = [
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    description:
      "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron",
    Genre: {
      name: "Adventure",
      description:
        "Adventure is a type of fiction that usually presents danger, or gives the viewer a sense of excitement.",
    },
    director: {
      name: "Peter Jackson",
      bio: "Sir Peter Jackson made history with The Lord of the Rings trilogy, becoming the first person to direct three major feature films simultaneously. The Fellowship of the Ring, The Two Towers and The Return of the King were nominated for and collected a slew of awards from around the globe, with The Return of the King receiving his most impressive collection of awards. This included three Academy Awards® (Best Adapted Screenplay, Best Director and Best Picture), two Golden Globes (Best Director and Best Motion Picture-Drama), three BAFTAs (Best Adapted Screenplay, Best Film and Viewers' Choice), a Directors Guild Award, a Producers Guild Award and a New York Film Critics Circle Award.",
      birthYear: "October 31, 1961",
      deathYear: "",
    },
    imageURL:
      "https://github.com/jdussold/movie_api/blob/main/img/The_Lord_of_the_Rings_The_Fellowship_of_the_Ring_(2001).jpg",
  },
  {
    title: "The Lord of the Rings: The Two Towers",
    description:
      "While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron's new ally, Saruman, and his hordes of Isengard.",
    genre: {
      name: "Adventure",
      description:
        "Adventure is a type of fiction that usually presents danger, or gives the viewer a sense of excitement.",
    },
    director: {
      name: "Peter Jackson",
      bio: "Sir Peter Jackson made history with The Lord of the Rings trilogy, becoming the first person to direct three major feature films simultaneously. The Fellowship of the Ring, The Two Towers and The Return of the King were nominated for and collected a slew of awards from around the globe, with The Return of the King receiving his most impressive collection of awards. This included three Academy Awards® (Best Adapted Screenplay, Best Director and Best Picture), two Golden Globes (Best Director and Best Motion Picture-Drama), three BAFTAs (Best Adapted Screenplay, Best Film and Viewers' Choice), a Directors Guild Award, a Producers Guild Award and a New York Film Critics Circle Award.",
      birthYear: "October 31, 1961",
      deathYear: "",
    },
    imageURL:
      "https://github.com/jdussold/movie_api/blob/main/img/Lord_of_the_Rings_-_The_Two_Towers_(2002).jpg",
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    description:
      "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    genre: {
      name: "Adventure",
      description:
        "Adventure is a type of fiction that usually presents danger, or gives the viewer a sense of excitement.",
    },
    director: {
      name: "Peter Jackson",
      bio: "Sir Peter Jackson made history with The Lord of the Rings trilogy, becoming the first person to direct three major feature films simultaneously. The Fellowship of the Ring, The Two Towers and The Return of the King were nominated for and collected a slew of awards from around the globe, with The Return of the King receiving his most impressive collection of awards. This included three Academy Awards® (Best Adapted Screenplay, Best Director and Best Picture), two Golden Globes (Best Director and Best Motion Picture-Drama), three BAFTAs (Best Adapted Screenplay, Best Film and Viewers' Choice), a Directors Guild Award, a Producers Guild Award and a New York Film Critics Circle Award.",
      birthYear: "October 31, 1961",
      deathYear: "",
    },
    imageURL:
      "https://github.com/jdussold/movie_api/blob/main/img/The_Lord_of_the_Rings_-_The_Return_of_the_King_(2003).jpg",
  },
  {
    title: "The Hobbit: An Unexpected Journey",
    description:
      "A reluctant Hobbit, Bilbo Baggins, sets out to the Lonely Mountain with a spirited group of dwarves to reclaim their mountain home, and the gold within it from the dragon Smaug.",
    genre: {
      name: "Adventure",
      description:
        "Adventure is a type of fiction that usually presents danger, or gives the viewer a sense of excitement.",
    },
    director: {
      name: "Peter Jackson",
      bio: "Sir Peter Jackson made history with The Lord of the Rings trilogy, becoming the first person to direct three major feature films simultaneously. The Fellowship of the Ring, The Two Towers and The Return of the King were nominated for and collected a slew of awards from around the globe, with The Return of the King receiving his most impressive collection of awards. This included three Academy Awards® (Best Adapted Screenplay, Best Director and Best Picture), two Golden Globes (Best Director and Best Motion Picture-Drama), three BAFTAs (Best Adapted Screenplay, Best Film and Viewers' Choice), a Directors Guild Award, a Producers Guild Award and a New York Film Critics Circle Award.",
      birthYear: "October 31, 1961",
      deathYear: "",
    },
    imageURL:
      "https://github.com/jdussold/movie_api/blob/main/img/The_Hobbit-_An_Unexpected_Journey.jpeg",
  },
  {
    title: "The Hobbit: The Desolation of Smaug",
    description:
      "The dwarves, along with Bilbo Baggins and Gandalf the Grey, continue their quest to reclaim Erebor, their homeland, from Smaug. Bilbo Baggins is in possession of a mysterious and magical ring.",
    genre: {
      name: "Adventure",
      description:
        "Adventure is a type of fiction that usually presents danger, or gives the viewer a sense of excitement.",
    },
    director: {
      name: "Peter Jackson",
      bio: "Sir Peter Jackson made history with The Lord of the Rings trilogy, becoming the first person to direct three major feature films simultaneously. The Fellowship of the Ring, The Two Towers and The Return of the King were nominated for and collected a slew of awards from around the globe, with The Return of the King receiving his most impressive collection of awards. This included three Academy Awards® (Best Adapted Screenplay, Best Director and Best Picture), two Golden Globes (Best Director and Best Motion Picture-Drama), three BAFTAs (Best Adapted Screenplay, Best Film and Viewers' Choice), a Directors Guild Award, a Producers Guild Award and a New York Film Critics Circle Award.",
      birthYear: "October 31, 1961",
      deathYear: "",
    },
    imageURL:
      "https://github.com/jdussold/movie_api/blob/main/img/The_Hobbit_-_The_Desolation_of_Smaug_theatrical_poster.jpg",
  },
  {
    title: "The Hobbit: The Battle of Five Armies",
    description:
      "Bilbo and company are forced to engage in a war against an array of combatants and keep the Lonely Mountain from falling into the hands of a rising darkness.",
    genre: {
      name: "Adventure",
      description:
        "Adventure is a type of fiction that usually presents danger, or gives the viewer a sense of excitement.",
    },
    director: {
      name: "Peter Jackson",
      bio: "Sir Peter Jackson made history with The Lord of the Rings trilogy, becoming the first person to direct three major feature films simultaneously. The Fellowship of the Ring, The Two Towers and The Return of the King were nominated for and collected a slew of awards from around the globe, with The Return of the King receiving his most impressive collection of awards. This included three Academy Awards® (Best Adapted Screenplay, Best Director and Best Picture), two Golden Globes (Best Director and Best Motion Picture-Drama), three BAFTAs (Best Adapted Screenplay, Best Film and Viewers' Choice), a Directors Guild Award, a Producers Guild Award and a New York Film Critics Circle Award.",
      birthYear: "October 31, 1961",
      deathYear: "",
    },
    imageURL:
      "https://github.com/jdussold/movie_api/blob/main/img/The_Hobbit_-_The_Battle_of_the_Five_Armies.png",
  },
  {
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre: {
      name: "Action",
      description:
        "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
    },
    director: {
      name: "Christopher Nolan",
      bio: "Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made.",
      birthYear: "July 30, 1970",
      deathYear: "",
    },
    imageURL:
      "https://github.com/jdussold/movie_api/blob/main/img/The_Dark_Knight_(2008_film).jpg",
  },
  {
    title: "The Matrix",
    description:
      "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
    genre: {
      name: "Action",
      description:
        "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
    },
    Director: {
      name: "Lana and Lilly Wachowski",
      bio: "Lana Wachowski and her sister Lilly Wachowski, also known as the Wachowskis, are the duo behind such ground-breaking movies as The Matrix (1999) and Cloud Atlas (2012). Born to mother Lynne, a nurse, and father Ron, a businessman of Polish descent, Wachowski grew up in Chicago and formed a tight creative relationship with her sister Lilly. After the siblings dropped out of college, they started a construction business and wrote screenplays. Their 1995 script, Assassins (1995), was made into a movie, leading to a Warner Bros contract. After that time, the Wachowskis devoted themselves to their movie careers. In 2012, during interviews for Cloud Atlas and in her acceptance speech for the Human Rights Campaign's Visibility Award, Lana spoke about her experience of being a transgender woman, sacrificing her much cherished anonymity out of a sense of responsibility. Lana is known to be extremely well-read, loves comic books and exploring ideas of imaginary worlds, and was inspired by Stanley Kubrick's 2001: A Space Odyssey (1968) in creating Cloud Atlas.",
      birthYear: "June 21, 1965",
      deathYear: "",
    },
    imageURL:
      "https://github.com/jdussold/movie_api/blob/main/img/The_Matrix_Poster.jpg",
  },
  {
    title: "John Wick",
    description:
      "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took his car.",
    genre: {
      name: "Action",
      description:
        "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
    },
    director: {
      name: "Chad Stahelski",
      bio: "He came from a kick-boxing background; he entered the film field as a stunt performer at the age of 24. Before that, he worked as an instructor at the Inosanto Martial Arts Academy in California, teaching Jeet Kune Do/Jun Fan. After doing numerous roles in low budget martial art movies like Mission of Justice (1992) and Bloodsport III (1996) his first start as a stunt double came from the movie The Crow (1994) for doubling late Brandon Lee whom he trained with at the Inosanto Academy. After Brandon Lee's lethal accident Chad was picked for his stunt/photo double because he knew Lee, how he moved, and looked more like him than any other stuntman. His greatest break as a stunt man came when he hooked up with Keanu Reeves on The Matrix (1999). He worked as martial arts stunt coordinator in its following sequels and doubled Keanu Reeves for extreme shots. He also formed a company called Smashcut with his stunt colleagues which was responsible for cool stunts in some of the greatest movies and series.  After a ten year in the film world he continued to give his best as a stunt coordinator and stunt performer.",
      birthYear: "September 20, 1968",
      deathYear: "",
    },
    imageURL:
      "https://github.com/jdussold/movie_api/blob/main/img/John_Wick_TeaserPoster.jpg",
  },
  {
    title: "Princess Mononoke",
    description:
      "On a journey to find the cure for a Tatarigami's curse, Ashitaka finds himself in the middle of a war between the forest gods and Tatara, a mining colony. In this quest he also meets San, the Mononoke Hime.",
    genre: {
      name: "Animation",
      description:
        "Animation is a method in which pictures are manipulated to appear as moving images. In traditional animation, images are drawn or painted by hand on transparent celluloid sheets to be photographed and exhibited on film.",
    },
    director: {
      name: "Hayao Miyazaki",
      bio: "Hayao Miyazaki is one of Japan's greatest animation directors. The entertaining plots, compelling characters, and breathtaking animation in his films have earned him international renown from critics as well as public recognition within Japan.",
      birthYear: "January 5, 1941",
      deathYear: "",
    },
    imageURL:
      "https://github.com/jdussold/movie_api/blob/main/img/Princess_Mononoke_Japanese_poster.png",
  },
  {
    title: "Monty Python and the Holy Grail",
    description:
      "King Arthur and his Knights of the Round Table embark on a surreal, low-budget search for the Holy Grail, encountering many, very silly obstacles.",
    Genre: {
      name: "Comedy",
      description:
        "Comedy is a genre of film in which the main emphasis is on humor. These films are designed to make the audience laugh through amusement and most often work by exaggerating characteristics for humorous effect.",
    },
    director: {
      name: "Terry Gilliam",
      bio: "Terry Gilliam was born near Medicine Lake, Minnesota. When he was 12 his family moved to Los Angeles where he became a fan of MAD magazine. In his early twenties he was often stopped by the police who suspected him of being a drug addict and Gilliam had to explain that he worked in advertising. In the political turmoil in the 60's, Gilliam feared he would become a terrorist and decided to leave the USA. He moved to England and landed a job on the children's television show Do Not Adjust Your Set (1967) as an animator. There he met meet his future collaborators in Monty Python: Terry Jones, Eric Idle and Michael Palin. In 2006 he renounced his American citizenship.",
      birthYear: "November 22, 1940",
      deathYear: "",
    },
    imageURL:
      "https://github.com/jdussold/movie_api/blob/main/img/Monty_Python_and_the_Holy_Grail.jpg",
  },
]; */

// GET requests / READ endpoints

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
// app.get("/movies/:title", (req, res) => {
//   Movies.findOne({ Title: req.params.title })
//     .then((movie) => {
//       res.status(200).json(movie);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send("Error: " + err);
//     });
// });

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
        res.send(error.message);
      });
  }
);

//Get information about a specific genre of film
// app.get("/movies/genres/:name", (req, res) => {
//   Movies.findOne({ "Genre.Name": req.params.name })
//     .then((movie) => {
//       res.status(200).json(movie.Genre.Description);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send("Error: " + err);
//     });
// });

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
        res.send(error.message);
      });
  }
);

//Get information about a specific director
// app.get("/movies/directors/:name", (req, res) => {
//   Movies.findOne({ "Director.Name": req.params.name })
//     .then((movie) => {
//       res.status(200).json(movie.Director.Bio);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send("Error: " + err);
//     });
// });

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
        res.send(error.message);
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
// app.get("/users/:Username", (req, res) => {
//   Users.findOne({ Username: req.params.Username })
//     .then((user) => {
//       res.json(user);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send("Error: " + err);
//     });
// });

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
      .catch((error) => {
        // error..
        res.send(error.message);
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
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
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
