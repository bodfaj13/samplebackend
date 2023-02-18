require('dotenv').config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const mongoose = require('mongoose');
const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_IP, MONGODB_PORT } = require('./config/config')

const mongoDBURL = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_IP}:${MONGODB_PORT}/`

mongoose.set('strictQuery', false);

const connetWithRetry = () => {
  mongoose.connect(mongoDBURL)
    .then(() => console.log('Connected to db successfully'))
    .catch((error) => {
      console.log("error", error)
      setTimeout(() => {
        connetWithRetry()
      }, 5000);
    })
}

connetWithRetry()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.enable("trust proxy");
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.set('view engine', 'HTML');

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);

module.exports = app;
