require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Import routes
const authRoute = require('./routes/Auth.route.js');
const eventRoutes = require('./routes/Event.route.js');
const userRoutes = require('./routes/User.route.js');
const ticketsRoutes = require('./routes/Ticket.route.js');
const contactRoutes = require('./routes/Contact.route.js');
// Load environment variables
dotenv.config();

const app = express();
app.use(cookieParser());

// CORS options - adjust origin for Render or dynamic front-end URL
const corsOptions = {
    origin: 'https://ctrl-nine.vercel.app', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true // Allow cookies if needed
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up the port from environment variables
const PORT = process.env.PORT;

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
        console.log('Connected to database!');
    })
    .catch((err) => {
        console.error('Connection failed:', err);
    });

// Routes
app.use('/api/auth', authRoute);
app.use('/api/events', eventRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/contact', contactRoutes);

// Serve static files from the 'client/dist' directory
app.use(express.static(path.join(__dirname, '/client/dist')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple base route
app.get('/', (req, res) => res.send('Hello World!'));
