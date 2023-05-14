const mongoose = require("mongoose"),
  bcrypt = require("bcrypt");

/**
 * Schema for movies.
 * @typedef {Object} MovieSchema
 * @property {string} Title - The title of the movie.
 * @property {string} Description - The description of the movie.
 * @property {Object} Genre - The genre of the movie.
 * @property {string} Genre.Name - The name of the genre.
 * @property {string} Genre.Description - The description of the genre.
 * @property {Object} Director - The director of the movie.
 * @property {string} Director.Name - The name of the director.
 * @property {string} Director.Bio - The biography of the director.
 * @property {string[]} Actors - The list of actors in the movie.
 * @property {string} ImagePath - The path to the movie's image.
 * @property {boolean} Featured - Indicates if the movie is featured.
 * @property {string} BackdropImage - The path to the movie's backdrop image.
 */

/**
 * Schema for users.
 * @typedef {Object} UserSchema
 * @property {string} Username - The username of the user.
 * @property {string} Password - The password of the user.
 * @property {string} Email - The email of the user.
 * @property {Date} Birthday - The birthday of the user.
 * @property {mongoose.Schema.Types.ObjectId[]} FavoriteMovies - The list of favorite movies for the user.
 */

/**
 * Mongoose schema for movies.
 * @type {mongoose.Schema<MovieSchema>}
 */

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
  BackdropImage: String,
});

/**
 * Mongoose schema for users.
 * @type {mongoose.Schema<UserSchema>}
 */
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

/**
 * Hashes a user's password.
 * @param {string} password - The password to hash.
 * @returns {string} The hashed password.
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Validates a user's password.
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password is valid, false otherwise.
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

/**
 * Movie model.
 * @type {mongoose.Model<movieSchema>}
 */
let Movie = mongoose.model("Movie", movieSchema);

/**
 * User model.
 * @type {mongoose.Model<userSchema>}
 */
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
