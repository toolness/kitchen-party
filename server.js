var http = require('http'),
    io = require('./socket.io'),
    fs = require('fs'),
    sys = require('sys'),
    url = require('url');

var STATIC_FILES_DIR = './static-files'
var INDEX_FILE = '/index.html';
var STATIC_FILES = {
  '/index.html': 'text/html'
, '/jquery.min.js': 'application/javascript'
, '/jschannel.js': 'application/javascript'
, '/example-instrument.html': 'text/html'
};

var server = http.createServer(function(req, res) {
  var info = url.parse(req.url);
  var path = info.pathname == '/' ? INDEX_FILE : info.pathname;

  console.log("path", path);

  if (path in STATIC_FILES) {
    res.writeHead(200, {'Content-Type': STATIC_FILES[path]});
    var file = fs.createReadStream(STATIC_FILES_DIR + path);
    sys.pump(file, res);
  } else {
    res.writeHead(404, 'Not Found', {'Content-Type': 'text/plain'});
    res.end('Not Found: ' + path);
  }
});

var socket = io.listen(server, {
  transports: [
    'websocket'
,   'server-events'
,   'htmlfile'
,   'xhr-multipart'
,   'xhr-polling'
  ]
});

var users = require('./users').build();

socket.on('connection', users.onConnection);
server.listen(8080);
