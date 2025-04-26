require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./models');
const routes = require('./routes');
const http = require('http');
const setupSocket = require('./src/socket'); // 👈 New import

const app = express();
const server = http.createServer(app);
const io = setupSocket(server); // 👈 Setup socket
app.set('io', io);

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// API Routes
app.use('/api', routes);

// Error Handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({ error: err.message || 'Server Error' });
});

// DB Connection
db.sequelize.authenticate()
  .then(() => console.log('Database connection established!'))
  .catch(err => console.error('Database connection error:', err));

// Start server
server.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
