var express = require('express');
var socket = require('socket.io');

//App setup
var app = express();
var  server = app.listen(4000, function() {
    console.log('listening to requests on port 4000')
});

//Static files
app.use(express.static('public'));

var countdown = 45;

// Socket setup & pass server
var io = socket(server);
io.sockets.on('connection', function(socket) {

    console.log('made socket connection', socket.id);

    socket.on('upvoting', function (data) {
        socket.broadcast.emit('upvoting', data);
    });


    /*

    socket.on('resetTimer', function () {
        countdown = 45;
    });

    */


});

setInterval(function() {
    countdown--;
    if (countdown == 0) {
        io.sockets.emit('endOfTime', { string: 'Süre sona erdi' });
        clearInterval(this);
    }
    io.sockets.emit('timer', { countdown: countdown });

}, 1000);




//Todo: To run the program, write 'nodemon index' to console