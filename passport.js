const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

/**
 * User model.
 * @typedef {Object} User
 * @property {string} username - The username of the user.
 * @property {string} password - The password of the user.
 * ...
 */
let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

/**
 * Passport local strategy for authenticating users.
 * @type {passport.Strategy}
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    /**
     * Local strategy callback function.
     * @param {string} username - The username.
     * @param {string} password - The password.
     * @param {Function} callback - The callback function.
     */
    (username, password, callback) => {
      console.log(username + "  " + password);
      Users.findOne({ Username: username }, (error, user) => {
        if (error) {
          console.log(error);
          return callback(error);
        }

        if (!user) {
          console.log("incorrect username");
          return callback(null, false, { message: "Incorrect username." });
        }

        if (!user.validatePassword(password)) {
          console.log("incorrect password");
          return callback(null, false, { message: "Incorrect password." });
        }

        console.log("finished");
        return callback(null, user);
      });
    }
  )
);

/**
 * Passport JWT strategy for authenticating users using JWT.
 * @type {passportJWT.Strategy}
 */
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    /**
     * JWT strategy callback function.
     * @param {Object} jwtPayload - The decoded JWT payload.
     * @param {Function} callback - The callback function.
     */
    (jwtPayload, callback) => {
      return Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
