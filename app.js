var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , request = require('request')
  , twitter = require('twitter')
  , util = require('util');

var app = module.exports = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: process.env.COOKIE_SECRET }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/twitter/search/:term', function(req, res){

  console.log("Twittering...");
  var twitterConfig = JSON.parse(process.env.TWITTER);

  console.log(twitterConfig);

  var twit = new twitter({
      consumer_key: twitterConfig.consumer_key,
      consumer_secret: twitterConfig.consumer_secret,
      access_token_key: twitterConfig.access_token_key,
      access_token_secret: twitterConfig.access_token_secret
  });

  //Twitter.prototype.search = function(q, params, callback)

  twit.search(req.params.term, req.query, function(data) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin':'*'
    });
    res.end(JSON.stringify(data));
  });



});

app.get('/user/search/:username', routes.json, routes.search_user);
app.get('/rate_limit_status', routes.json, routes.rate_limit_status);


app.get('/', routes.index);

if(process.env.DEBUG == 'true') {
  console.log("DEBUG ENABLED");
  app.get('/session', function(req, res){
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(req.session));
  });
};

http.createServer(app).listen(app.get('port'), function(){
  console.log("Twitter proxy server listening on port: " + app.get('port'));
});
