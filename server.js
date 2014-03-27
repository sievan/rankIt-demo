var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    mime = require("mime")
    io = require('socket.io').listen(8080),
    shortId = require('shortid'),
    rankAArray = {};
    id = 0,
    hasVoted = {};
    port = process.argv[2] || 8888;

/* Sets up webserver
*/
http.createServer(function(request, response) {
 
  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }
 
    if (fs.statSync(filename).isDirectory()) filename += '/index.html';
 
    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }
 
      response.writeHead(200, {"Content-Type": mime.lookup(filename)});
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));


/* Sets up websocket with socket.io
*/
io.sockets.on('connection', function(socket) {
  console.log(socket.id)
  console.log('client connected');
  hasVoted[socket.id] = false;
  socket.emit('newList', rankAArray);
  socket.on('upVote', function(data){
    //if(hasVoted[socket.id] === false) {
      rankAArray[data].votes += 1;
      io.sockets.emit('newUpVote', data);
      console.log(data + ' ' + rankAArray[data].votes);
      hasVoted[socket.id] = true;
    //}
  });
});


// DEBUG PLACEHOLDERS
rankAArray[shortId.generate()] = {title: 'foo', votes: 0};
rankAArray[shortId.generate()] = {title: 'bar', votes: 0};
rankAArray[shortId.generate()] = {title: 'baz', votes: 0};
rankAArray[shortId.generate()] = {title: 'spam', votes: 0};
rankAArray[shortId.generate()] = {title: 'eggs', votes: 0};


console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
