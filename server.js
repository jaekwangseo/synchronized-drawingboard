var path = require('path');
var express = require('express');
let socketio = require('socket.io');
let EventEmitter = require('events');
var server = require('http').createServer();
var app = express(); // the app returned by express() is a JavaScript Function. Not something we can pass to our sockets!

let drawings = {default: []};




// app.listen() returns an http.Server object
// http://expressjs.com/en/4x/api.html#app.listen
server.listen(1337, function () {
    console.log('The server is listening on port 1337!');
});
server.on('request', app);
var io = socketio(server);

io.on('connection', function(socket) {
    socket.emit('pageLoad', drawings.default);
    console.log('default drawing counts:', drawings.default.length);
    console.log(`a connection was made from ${socket.id}` );
    socket.on('draw', function(start, end, color) {
        //console.log(start, end, color)
        drawings.default.push([start, end, color]);
        socket.broadcast.emit('drawFromOthers', start, end, color)
    })
})



app.use(express.static(path.join(__dirname, 'browser')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/:id', function (req, res) {
    let channel = '/' + req.params.id;
    let nsp = io.of(channel);
    nsp.on('connection', function(socket) {
        if(!drawings[channel]) {
            drawings[channel] = [];
        }

        socket.emit('pageLoad', drawings[channel]);
        //socket.emit('channel', req.params.id);
        console.log('drawing counts: on ' + channel, drawings[channel].length);
        console.log(`a connection was made from ${socket.id}` );
        console.log('you are on namespace: /' + req.params.id);
        socket.on('draw', function(start, end, color) {
            //console.log(start, end, color)

            drawings[channel].push([start, end, color]);
            socket.broadcast.emit('drawFromOthers', start, end, color)
        })
    })

    res.sendFile(path.join(__dirname, 'index.html'));
});

