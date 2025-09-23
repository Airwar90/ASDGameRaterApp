require('dotenv').config();
const cors = require('cors');
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const db = require('./database/database');
const app = express();

app.use(cors());
app.use(express.json());

//api routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);

app.listen(8080, () => {
    console.log("Server running on 8080");
});