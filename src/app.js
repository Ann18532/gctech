const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./db/connect');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const authRoutes = require('./auth/authRoutes');
const integrationRoutes = require('./integration/integrationRoutes');
const leaveRoutes = require('./leaves/leaveRoutes');

dotenv.config();
require('./auth/googleStrategy');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-default-secret', // Use a secure secret
    resave: false, // Prevents unnecessary session saving
    saveUninitialized: false, // Only saves sessions when necessary
    cookie: { secure: false } // Set to `true` if using HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session()); // Enables session support for Passport.js

// Routes
app.use('/auth', authRoutes);
app.use('/api/integration', integrationRoutes);
app.use('/api/leaves', leaveRoutes);

app.get('/', (req, res) => {
  res.send('🟢 Universal ERP Platform Running');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

module.exports = app;
