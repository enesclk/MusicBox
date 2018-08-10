var firebase = require('firebase');
var express = require('express');
var socket = require('socket.io');


//App setup
var app = express();
var  server = app.listen(4000, function() {
    console.log('listening to requests on port 4000')
});


// Initialize Firebase
var config = {
    apiKey: "AIzaSyAxqXVwq3POeLSx6tLHuK8OYiv7MuTv8Mw",
    authDomain: "musicbox-b9442.firebaseapp.com",
    databaseURL: "https://musicbox-b9442.firebaseio.com",
    projectId: "musicbox-b9442",
    storageBucket: "musicbox-b9442.appspot.com",
    messagingSenderId: "133777007114"
};
firebase.initializeApp(config);

const allMusics = firebase.database().ref("musics");

allMusics.once("value")
    .then(function(snapshot) {
        snapshot.forEach(childSnapshot => {
            var key = childSnapshot.key; //Şarkı adı

            allMusics.update({[key] : 0}); // köşeli parantez içine almazsak key'i bir değişken olarak almıyor.

        });
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