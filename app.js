const express = require('express');
const path = require('path'); //used to get the .env file path
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);


module.exports = app;
