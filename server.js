var http = require("http").createServer(httpHandler),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    mime = require("mime")
    io = require('socket.io').listen(http),
    shortId = require('shortid'),
    rankAArray = {},
    banner = {
      heading: "Which is the best fruit?",
      subheading: "Press any button to vote"
    },
    id = 0,
    hasVoted = {},
    port = process.env.PORT || 5000;


http.listen(parseInt(port, 10))

/* Sets up webserver
*/
function httpHandler(request, response) {
 
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
}


/* Sets up websocket with socket.io
*/
io.sockets.on('connection', function(socket) {
  console.log(socket.id)
  console.log('client connected');
  hasVoted[socket.id] = false;
  socket.emit('banner', banner);
  socket.emit('newList', rankAArray);
  socket.on('upVote', function(data){
    // Commented out for demo purposes
    // if(hasVoted[socket.id] === false) {
      rankAArray[data].votes += 1;
      io.sockets.emit('newUpVote', data);
      console.log(data + ' ' + rankAArray[data].votes);
      hasVoted[socket.id] = true;
    //}
  });
});


// DEBUG PLACEHOLDERS
rankAArray[shortId.generate()] = {title: 'Apple', votes: 0};
rankAArray[shortId.generate()] = {title: 'Orange', votes: 0};
rankAArray[shortId.generate()] = {title: 'Pear', votes: 0};
rankAArray[shortId.generate()] = {title: 'Melon', votes: 0};
rankAArray[shortId.generate()] = {title: 'Mango', votes: 0};


console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
