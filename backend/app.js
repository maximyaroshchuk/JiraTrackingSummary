// app.js

const express = require('express');
const cors = require('cors');
const indexRoutes = require('./routes/index');
const {register, login} = require("./controllers/authController");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/register', register);
app.post('/login', login);

// Protected routes
app.use('/', indexRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
