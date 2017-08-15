var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/gslvote";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  app.db = db;
});


app.post('/vote',function(req,res){
    console.log(req.body)
    var vote = req.body
    console.log("vote", vote)
    app.db.collection("votes").insertOne(vote, function(err){
        if (err) throw err;
        res.end("Yes")
    })
})

app.get('/votes',function(req,res){
    app.db.collection("votes").find({}).toArray(function(err,result){
        if (err) throw err;
        res.json(result)
    })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
