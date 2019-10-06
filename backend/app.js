'use strict';
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const socket = require('socket.io');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const DEV_PORT = 3000;

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(process.env.PORT || DEV_PORT, () => {
  console.log('server is running!');
  console.log(`app listen on port ${server.address().port}!`);
});

const io = socket(server);

io.on('connection', function(socket) {

  console.log(`a user connected[id:${ socket.id }]`);

  // get all clients
  // type is object, key is socket id
  let clientsNow = io.sockets.clients().server.eio.clients;

  let playersView = Object.keys(clientsNow).map(element => {
    let isMyself = (socket.id === element);
    return {
      name: element,
      score: 0,
      isMyself: isMyself
    };
  });

  // emit playersList
  io.emit("playersView", playersView);
  
});

module.exports = app;
