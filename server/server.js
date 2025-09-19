const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// Suppress Mongoose strictQuery warning
mongoose.set('strictQuery', true);

// --------- ROUTES START --------- //


// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);


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
