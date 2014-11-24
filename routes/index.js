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
