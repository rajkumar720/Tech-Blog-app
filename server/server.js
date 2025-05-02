const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');
require('dotenv').config();
const dbUrl = process.env.DATABASE_URL;


const port=8080
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

mongoose.connect(dbUrl)
  .then(() => app.listen(5000, () => console.log('Server running on 5000')));
  
