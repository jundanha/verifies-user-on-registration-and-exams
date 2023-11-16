const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT ?? 5000;

app.use(cors());
app.use(bodyParser.json());

const dbUrl = process.env.DB_URL ?? 'mongodb://127.0.0.1:27017/dicoding-db'

mongoose.connect(dbUrl)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.error(err)
  });

const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// TODO: express error handler