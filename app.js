const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();


const authRoutes = require('./routes/authRoutes');
const mainRoutes = require('./routes/mainadminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ' http://localhost:3000',  // Replace with your frontend's URL
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  }));
app.use(express.json());
app.use(bodyParser.json());

// Routes
// const routes = require('./routes');
// app.use('/api', routes);

// Test route to verify server is running
app.get("/", (req, res) => {
    res.send('Hello world');
});

app.use('/', authRoutes);
app.use('/', mainRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


module.exports = app;
