const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;

//IMPORTING and Using ROUTES
const authRoute = require('./routes/auth');
app.use('/auth', authRoute)

//using the cors
app.use(cors());

//Using cross site requests
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

//Using the JSON payloads to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // To parse the incoming requests with JSON payloads

//mongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/notes', { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

//App listening on 4000
app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});

