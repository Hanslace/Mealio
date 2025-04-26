require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./models'); // index.js that loads Sequelize models
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Register all routes under /api
app.use('/api', routes);


app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  const statusCode = err.status || 500;
  const message = err.message || 'Server Error';
  res.status(statusCode).json({ error: message });
});

db.sequelize.authenticate()
  .then(() => {
    console.log('Database connection established!');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

app.listen(PORT, () => {
  console.log(`✅ Server is listening on port ${PORT}`);
});
