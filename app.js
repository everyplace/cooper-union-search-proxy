var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , request = require('request')
  , twitter = require('twitter')
  , util = require('util')
  , apicache = require('apicache').options({ debug: true }).middleware;

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

app.get('/twitter/search', apicache('5 minutes'), routes.json, routes.search_tweets);
app.get('/user/search/:username', routes.json, routes.search_user);
app.get('/rate_limit_status', routes.json, routes.rate_limit_status);
app.get('/geo/reverse_geocode', routes.json, routes.reverse_geocode);

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
