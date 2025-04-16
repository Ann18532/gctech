const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.T_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  const user = {
    id: profile.id,
    name: profile.displayName,
    email: profile.emails?.[0]?.value,
    accessToken
  };
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user); // full user in session
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
