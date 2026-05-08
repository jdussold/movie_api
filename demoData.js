const movies = [
  {
    _id: "demo-001",
    Title: "The Godfather",
    Description:
      "The aging patriarch of an organized crime dynasty in postwar New York transfers control of his clandestine empire to his reluctant youngest son.",
    Genre: {
      Name: "Crime",
      Description:
        "Crime films focus on criminals, organized crime, and the morally ambiguous individuals who pursue or evade them.",
    },
    Director: {
      Name: "Francis Ford Coppola",
      Bio: "American film director, producer, and screenwriter, born April 7, 1939. Coppola is widely considered one of the most influential filmmakers of the New Hollywood era.",
    },
    Actors: ["Marlon Brando", "Al Pacino", "James Caan"],
    ImagePath:
      "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    Featured: true,
    BackdropImage:
      "https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
  },
  {
    _id: "demo-002",
    Title: "The Shawshank Redemption",
    Description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    Genre: {
      Name: "Drama",
      Description:
        "Drama films are serious presentations or stories with settings that portray realistic characters in conflict with themselves, others, or forces of nature.",
    },
    Director: {
      Name: "Frank Darabont",
      Bio: "Hungarian-American film director, screenwriter, and producer, born January 28, 1959. Best known for his adaptations of Stephen King novels.",
    },
    Actors: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    ImagePath:
      "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    Featured: true,
    BackdropImage:
      "https://image.tmdb.org/t/p/original/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg",
  },
  {
    _id: "demo-003",
    Title: "The Dark Knight",
    Description:
      "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    Genre: {
      Name: "Action",
      Description:
        "Action films are characterized by physical feats, fight sequences, chases, and large-scale battles, where the protagonist is thrust into a series of high-stakes events.",
    },
    Director: {
      Name: "Christopher Nolan",
      Bio: "British-American filmmaker, born July 30, 1970. Known for his thematically and structurally ambitious films, including the Dark Knight trilogy, Inception, and Interstellar.",
    },
    Actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    ImagePath:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    Featured: true,
    BackdropImage:
      "https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
  },
  {
    _id: "demo-004",
    Title: "Pulp Fiction",
    Description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    Genre: {
      Name: "Crime",
      Description:
        "Crime films focus on criminals, organized crime, and the morally ambiguous individuals who pursue or evade them.",
    },
    Director: {
      Name: "Quentin Tarantino",
      Bio: "American filmmaker, born March 27, 1963. Known for his nonlinear storytelling, stylized violence, and references to popular culture.",
    },
    Actors: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    ImagePath:
      "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    Featured: false,
    BackdropImage:
      "https://image.tmdb.org/t/p/original/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg",
  },
  {
    _id: "demo-005",
    Title: "Inception",
    Description:
      "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
    Genre: {
      Name: "Sci-Fi",
      Description:
        "Science fiction films use speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science.",
    },
    Director: {
      Name: "Christopher Nolan",
      Bio: "British-American filmmaker, born July 30, 1970. Known for his thematically and structurally ambitious films, including the Dark Knight trilogy, Inception, and Interstellar.",
    },
    Actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    ImagePath:
      "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    Featured: true,
    BackdropImage:
      "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
  },
  {
    _id: "demo-006",
    Title: "The Matrix",
    Description:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    Genre: {
      Name: "Sci-Fi",
      Description:
        "Science fiction films use speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science.",
    },
    Director: {
      Name: "Lana Wachowski",
      Bio: "American film director, writer, and producer, born June 21, 1965. Co-directed The Matrix franchise with her sister Lilly Wachowski.",
    },
    Actors: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    ImagePath:
      "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    Featured: false,
    BackdropImage:
      "https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
  },
];

module.exports = { movies };
