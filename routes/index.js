var twitter = require('twitter');
var util = require('util');
var twitterConfig = JSON.parse(process.env.TWITTER);
var twit = new twitter({
    consumer_key: twitterConfig.consumer_key,
    consumer_secret: twitterConfig.consumer_secret,
    access_token_key: twitterConfig.access_token_key,
    access_token_secret: twitterConfig.access_token_secret
});

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.json = function(req, res, next){
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin':'*'
  });
  next();
};

exports.search_user = function(req, res) {

    twit.get('/users/lookup.json', {'screen_name':req.params.username}, function(data) {
        // console.log(util.inspect(data), res.statusCode);
        // console.log(data, res);
        res.end(JSON.stringify(data));
    });

};

exports.rate_limit_status = function(req, res) {

  twit.get('/application/rate_limit_status.json', function(data) {
    // console.log(util.inspect(data), res.statusCode);
    // console.log(data, res);
    res.end(JSON.stringify(data));
  });

};

exports.reverse_geocode = function(req, res) {

  if(req.query.lat && req.query.long) {

    var options = {
      lat: req.query.lat,
      long: req.query.long
    }

    twit.get('/geo/reverse_geocode.json', options, function(data) {
      // console.log(util.inspect(data), res.statusCode);
      // console.log(data, res);
      res.end(JSON.stringify(data));
    });

  } else {
    var message = "no lat and long";
    console.log(message);
    res.end(message)
  }

};



exports.search_tweets = function(req, res, next) {

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

    twit.get('search/tweets', req.query, function(error, tweets, response){

      res.end(JSON.stringify({
        "error":error,
        "tweets":tweets,
        "response":response
      }))
      //
      // res.writeHead(200, {
      //   'Content-Type': 'application/json',
      //   'Access-Control-Allow-Origin':'*'
      // });
      // res.end(JSON.stringify(response));
    });
}
