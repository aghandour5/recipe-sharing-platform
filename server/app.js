// 1. Import necessary packages
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// 2. Create an Express application
const app = express();

// 3. Define the port the server will run on
// Use the environment variable PORT if it's set, otherwise default to 5000
const PORT = process.env.PORT || 5000;

// 4. Middleware
// Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet());
// Enable Cross-Origin Resource Sharing (CORS) for all routes
// This allows our frontend (e.g., on localhost:3000) to talk to our backend (localhost:5000)
app.use(cors());
// Morgan logs HTTP requests to the console
app.use(morgan('combined'));
// Express built-in middleware to parse JSON bodies
// This is crucial for POST and PUT requests where we send JSON data
app.use(express.json());

// 5. Define a simple root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Recipe Sharing Platform API!' });
});

// 6. Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});