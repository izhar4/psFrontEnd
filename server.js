/**
 * Application's main file. Set the module objects.
 */
var express = require('express'),
    http = require('http');
var bodyParser = require('body-parser');
var config = require('./config/vars');



//Initialize express object
var app = express();

app.use(express.static(__dirname + '/public/views'));
//set routes
app.use("/", express.static(__dirname + '/public/js/') );
app.use("/", express.static(__dirname + '/public/dist/') );
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/img", express.static(__dirname + '/public/img'));
app.use("/fonts", express.static(__dirname + '/public/fonts') );
app.use("/files",express.static(__dirname + '/public/files') );
app.use("/static",express.static(__dirname + '/public/static/') );
app.use("/node_modules", express.static(__dirname + '/node_modules'));
app.use("/bower_components", express.static(__dirname + '/bower_components'));


// Load up the routers
var routers = require('./routes');
routers.set(app);

if(app.get('env') === 'development') {
  /**
    * Custom error handler. Render the error message
    */
  app.use(function(err, req, res, next) {
   /* res.status(err.status || 500);
    res.sendfile('error.html', {root: __dirname +'/public'});*/
  });
}

//export the application object
module.exports = app;

var appPort = config.APP_PORT;
if(config.SSL_ENABLED)
{
    appPort = config.SSL_CONFIG.port;
    var https = require('https');
    var options = {
        key: fs.readFileSync(config.SSL_CONFIG.options.keyfile),
        cert: fs.readFileSync(config.SSL_CONFIG.options.certfile)
    };
    https.createServer(options,app).listen(appPort, function () {
        console.log("Server ready at http://localhost:"+appPort);
    });

}
else{
    //create the http server to listen on port 8000
    http.createServer(app).listen(appPort, function () {
        console.log("Server ready at http://localhost:"+appPort);
    });
}
