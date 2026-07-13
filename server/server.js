const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// Connect to Database
connectDB();

// Dynamic creation of upload directories
const directories = [
  'uploads',
  'uploads/projects',
  'uploads/profile',
  'uploads/resume'
];
directories.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Security Middlewares
// Customize Helmet content security policy to allow serving local uploaded assets safely
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS Configuration (No wildcards. Must specify origin for httpOnly cookie passing)
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5174'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true,
}));

// General Request Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiters
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 contact messages/submissions per window
  message: { message: 'Too many messages sent from this IP. Please try again after 15 minutes.' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Limit each IP to 20 login attempts per window
  message: { message: 'Too many login failures. Please try again after 15 minutes.' }
});

// Apply rate limits
app.use('/api/contact', contactLimiter);
app.use('/api/admin/login', loginLimiter);

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Middlewares
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// Catch 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: `API Endpoint Not Found: ${req.originalUrl}` });
});

// Error handling middleware (must be registered last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
