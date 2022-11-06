const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  morgan = require("morgan");

app.use(bodyParser.json());
app.use(morgan("common"));
app.use(express.static("public"));

let users = [
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
];

let movies = [
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
    title: "The Lord of the Rings: The Two Towers (2002)",
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
      name: "Adventure",
      description:
        "Adventure is a type of fiction that usually presents danger, or gives the viewer a sense of excitement.",
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
];

// GET requests / READ endpoints

//returns a welcome message
app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

//Get a full list of movies
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

//Get information about a single movie by title
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).send("no such movie");
  }
});

//Get information about a specific genre of film
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.genre.name === genreName).genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(404).send("no such genre");
  }
});

//Get information about a specific director
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.director.name === directorName
  ).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(404).send("no such director");
  }
});

//Returns the API documentation
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

// POST requests / CREATE endpoints

//Create new user
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(404).send("users need names");
  }
});

//Add new movie to users favorites
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(404).send("no such user");
  }
});

// DELETE requests/endpoints

//Remove a movie from users favorites
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(404).send("no such user");
  }
});

//Delete a user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(`user ${id} has been deleted`);
  } else {
    res.status(404).send("no such user");
  }
});

// PUT requests /UPDATE endpoints

//Update a username
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(404).send("no such user");
  }
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
