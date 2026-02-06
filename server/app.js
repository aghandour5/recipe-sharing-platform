const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path'); // Required for serving static files

// Route imports
const authRoutes = require('./routes/authRoutes'); // Import authRoutes
const categoryRoutes = require('./routes/categoryRoutes'); // Import categoryRoutes
const recipeRoutes = require('./routes/recipeRoutes'); // Import recipeRoutes
const userRoutes = require('./routes/userRoutes'); // Import userRoutes
const tagRoutes = require('./routes/tagRoutes'); // Import tagRoutes
const ratingRoutes = require('./routes/ratingRoutes'); // Import ratingRoutes
const commentRoutes = require('./routes/commentRoutes'); // Import commentRoutes
const adminRoutes = require('./routes/adminRoutes'); // Import adminRoutes

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

// Serve static files from the 'uploads' directory
// This makes images accessible via /uploads/filename.jpg
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Recipe Sharing Platform API!' });
});

app.use('/api/auth', authRoutes); // Routes for authentication
app.use('/api/categories', categoryRoutes); // Any route defined inside categoryRoutes will be prefixed with /api/categories.
app.use('/api/recipes', recipeRoutes); // Mount recipe routes
app.use('/api/users', userRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/ratings', ratingRoutes); // Mount rating routes
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

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
  // Create uploads directory if it doesn't exist
  const fs = require('fs');
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
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