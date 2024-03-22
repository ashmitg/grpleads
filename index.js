const express = require('express');
const db = require('./server/db/config')
const route = require('./server/controllers/route');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 5001
require('dotenv').config()
const fs = require('fs');
const path = require('path');

//Setup Express App
const app = express();
// Middleware
app.use(bodyParser.json({ limit: Infinity }));
// Set up CORS  
app.use(cors({ origin: true }));
//API Routes
app.use('/api', route);



if(process.env.NODE_ENV === 'production'){

    app.use(express.static('Client/build/'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'Client', 'build', 'index.html'));
    });
}

const server = app.listen(port, '0.0.0.0', () => {
    const protocol = (process.env.HTTPS === 'true' || process.env.NODE_ENV === 'production') ? 'https' : 'http';
    console.log(`Server listening at ${protocol}://${server.address().address}:${port}`);
});


// Connect to MongoDB
const DATABASE_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017'
// const DATABASE_URL = 'mongodb://127.0.0.1:27017'
const DATABASE = process.env.DB || 'GRPLEADS'

db(DATABASE_URL, DATABASE);