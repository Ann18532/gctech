const express = require('express');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./core/auth/authRoutes');
const hrRoutes = require('./core/hr/hrRoutes');

dotenv.config();
require('./core/auth/googleStrategy'); // Setup Google OAuth2

const app = express(); // Initialize the app
const PORT = process.env.PORT || 3000;

const connectDB = require('./core/db/connect');
const configRoutes = require('./core/config/configRoutes');

connectDB(); // MongoDB connection
app.use('/api/config', configRoutes);


// Middlewares
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
  
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api/hr', hrRoutes); // Moved here, after app initialization

app.get('/', (req, res) => {
  res.send('🟢 Universal ERP Login Portal Running');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
