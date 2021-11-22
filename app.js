const {
  PORT = 8080
} = process.env;
const {
  MONGODB_USERNAME,
  MONGODB_PASSWORD,
  MONGODB_DATABASE,
} =  require('./variables');
const mongoDBconnectionString = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.oocwe.mongodb.net/${MONGODB_DATABASE}`

const mongoose = require('mongoose');
const cors = require('cors');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socketHandlers = require('./socket');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const http = require('http').createServer(app);

// configure cors specifically to enable cors
var io = require('socket.io')(http,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});

app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// deal with socket.io, run whenever a client connects
io.on('connection', (socket) => {
  socketHandlers(socket, io);
  // set the socket instance at a global level so other controllers can use it
});

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



// connect to mongoose using the string
mongoose.connect(mongoDBconnectionString,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((db) => {
  // listen for http requests
  console.log('sucesfully connected to DB. starting server...')
  http.listen(PORT,() => console.log("app started on PORT:", PORT))
}).catch((err) => {
  console.log(err);
  console.log('there was an error connecting to mongodb database')
})
