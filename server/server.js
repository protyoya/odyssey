const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();


app.use(express.json());

const cors = require('cors');
const corsOptions = {
  origin: [
    'http://localhost:5200',
    'http://localhost:5100',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:4000',
    'http://localhost:8080',
  ],
  credentials: true,
};
app.use(cors(corsOptions));


// Suppress Mongoose strictQuery warning
mongoose.set('strictQuery', true);

// --------- ROUTES START --------- //


 const AuthoritiesSignup = require('./Routes/Authorities/signup');
 const AuthoritiesLogin = require('./Routes/Authorities/login');
 const AuthoritiesAdmin = require('./Routes/Authorities/admin/authorities');
 const TouristAuth = require('./Routes/Tourist/Auth');
 const TouristProfile = require('./Routes/Tourist/Profile');
 const FencingRoutes = require('./Routes/Fencing/fence');
const placesRoutes = require('./Routes/Places');
app.use('/api/auth/authorities', AuthoritiesSignup);
app.use('/api/auth/authorities', AuthoritiesLogin);
app.use('/api/authorities', AuthoritiesAdmin);
app.use('/api/tourist', TouristAuth);
app.use('/api/tour/profile', TouristProfile);
app.use('/api/authorities/fencing', FencingRoutes);
app.use('/api/places', placesRoutes);

// --------- ROUTES END --------- //


// Dev-only middleware
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// MongoDB connection
const MONGO_DB_URI = process.env.MONGO_DB_URI;
mongoose.connect(MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(`MongoDB connected in ${process.env.NODE_ENV} mode`))
.catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`));

module.exports = app; 
