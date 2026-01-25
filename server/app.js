const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Route imports
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// API Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Recipe Sharing Platform API!' });
});

app.use('/api/categories', categoryRoutes); // Any route defined inside categoryRoutes will be prefixed with /api/categories.

// --- Basic Error Handling Middleware ---
// This should be the last piece of middleware because Express processes middleware top-to-bottom.

// If a request makes it past all the routes defined above, it means the user asked for a URL that doesn't exist.
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the next middleware (the error handler)
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // If the response status is still 200 (OK), it assumes it's an unexpected server error and sets it to 500. Otherwise, it keeps the existing code (like 404).
  res.status(statusCode);
  res.json({
    message: err.message,
    // In development, you might want to send the stack trace
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});
// --- End of Error Handling ---


const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
/*
Graceful Shutdown: This listens for the SIGINT signal (Signal Interrupt). This signal is sent when you press Ctrl + C in your terminal to stop the server.
Instead of crashing immediately, the code logs "Shutting down gracefully," closes the server connection (server.close), and then exits the process.
This ensures all pending database requests or file operations finish before the app dies.
*/
process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});