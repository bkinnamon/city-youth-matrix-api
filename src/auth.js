const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JWTStrategy, ExtractJwt: ExtractJWT } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const { secret } = require('./secret.js');
const User = require('./user.js');

const LOCAL_CONFIG = {
  usernameField: 'username',
  passwordField: 'password',
  session: false,
};

const JWT_CONFIG = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

passport.use(
  'register',
  new LocalStrategy(
    LOCAL_CONFIG,
    async (username, password, done) => {
      const [user, error] = await User.register(username, password);
      if (error) return done(error);
      return done(null, user);
    },
  ),
);

passport.use(
  'login',
  new LocalStrategy(
    LOCAL_CONFIG,
    async (username, password, done) => {
      const [user, error] = await User.login(username, password);
      if (error) return done(error);
      return done(null, user);
    },
  ),
);

passport.use(
  'jwt',
  new JWTStrategy(
    JWT_CONFIG,
    async (payload, done) => {
      const [user, error] = await User.get(payload.id);
      if (error) done(error);
      done(null, user);
    },
  ),
);

function getAuthResponse(error, user) {
  if (error) return { error };
  return {
    user,
    token: jwt.sign({ id: user.id }, secret),
  };
}

module.exports = {
  auth: passport,
  getAuthResponse,
};
