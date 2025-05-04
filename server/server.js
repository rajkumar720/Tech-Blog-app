const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');
require('dotenv').config();
const dbUrl = process.env.DATABASE_URL;
const frontendUrl=process.env.API_URL;
const app = express();
app.use(cors({
  origin: process.env.API_URL, // Allow only frontend from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

mongoose.connect(dbUrl)
  .then(() => app.listen(5000, () => console.log('Server running on 5000')));
  
