// app.js

const express = require('express');
const cors = require('cors');
const generalRoutes = require('./routes/generalRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', generalRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
