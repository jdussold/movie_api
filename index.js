const express = require("express"),
  morgan = require("morgan");

const app = express();

app.use(morgan("common"));
app.use(express.static("public"));

let topMovies = [
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    description:
      "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron",
    director: "Peter Jackson",
  },
  {
    title: "The Lord of the Rings: The Two Towers (2002)",
    description:
      "While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron's new ally, Saruman, and his hordes of Isengard.",
    director: "Peter Jackson",
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    description:
      "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    director: "Peter Jackson",
  },
  {
    title: "The Hobbit: An Unexpected Journey",
    description:
      "A reluctant Hobbit, Bilbo Baggins, sets out to the Lonely Mountain with a spirited group of dwarves to reclaim their mountain home, and the gold within it from the dragon Smaug.",
    director: "Peter Jackson",
  },
  {
    title: "The Hobbit: The Desolation of Smaug",
    description:
      "The dwarves, along with Bilbo Baggins and Gandalf the Grey, continue their quest to reclaim Erebor, their homeland, from Smaug. Bilbo Baggins is in possession of a mysterious and magical ring.",
    director: "Peter Jackson",
  },
  {
    title: "The Hobbit: The Battle of Five Armies",
    description:
      "Bilbo and company are forced to engage in a war against an array of combatants and keep the Lonely Mountain from falling into the hands of a rising darkness.",
    director: "Peter Jackson",
  },
  {
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    director: "Christopher Nolan",
  },
  {
    title: "The Matrix",
    description:
      "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
    director: "Lana and Lilly Wachowski",
  },
  {
    title: "John Wick",
    description:
      "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took his car.",
    director: "Chad Stahelski",
  },
  {
    title: "Princess Mononoke",
    description:
      "On a journey to find the cure for a Tatarigami's curse, Ashitaka finds himself in the middle of a war between the forest gods and Tatara, a mining colony. In this quest he also meets San, the Mononoke Hime.",
    director: "Hayao Miyazaki",
  },
];

// GET requests
app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

// ERROR Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
