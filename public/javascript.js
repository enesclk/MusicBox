// Make connection
var socket = io.connect('http://localhost:4000');

//Todo: Our code starts here..

function upvote(id) { //HTML template'ten direk olarak tetikleniyor. Heart iconlarına tıklandığı zaman çalışıyor.
    console.log(id);
    var div = document.getElementById(id);
    var span = div.querySelectorAll(".count");
    var count = span[0].innerHTML;
    console.log(count);

    socket.emit('upvoting', { //Serverın yakalaması için bu event oluşturuldu.
        upvoteCount: count,
        upvotedTrack: id
    });
    span[0].innerHTML++;
}

socket.on('upvoting', function(data){ //socket.emit'ten farklı olarak bu fonksiyon server tarafından upvoting event'i tetiklendiğinde çalışıyor.
    var div = document.getElementById(data.upvotedTrack);
    var span = div.querySelectorAll(".count");
    span[0].innerHTML++;
});

socket.on('timer', function(data) {
    var div = document.getElementsByClassName('timer')[0];

    div.innerHTML = data.countdown+" seconds left";
});


socket.on('endOfTime', function (data) {

    var listOfTracks_div = document.getElementsByClassName('heart');

    var listOfTracks_span = [];


    Array.from(listOfTracks_div).forEach(function (item) {
        var span = item.querySelectorAll(".count")[0];
        listOfTracks_span.push(span);
        console.log(span);
    });

    var winnerTrack = listOfTracks_span[0];

    listOfTracks_span.forEach(function (item) { //En çok oyu alan şarkıyı bulmak için döngüyü oluşturdum.
        if (item.innerHTML > winnerTrack.innerHTML)
            winnerTrack = item;
    });

    var outerDiv = winnerTrack.parentNode.parentNode;
    var winner = outerDiv.getElementsByTagName('span')[0].innerHTML;

    playMusic(winner);

    var playingMusic = document.getElementsByClassName('notification')[0];

    playingMusic.innerHTML = "Çalan müzik : "+winner;

    //alert("Çalan müzik : "+winner);



});

function resetTimer() {
    socket.emit('resetTimer');
}

function playMusic(winnerTrack) {

    winnerTrack += ".mp3";

    audioList = document.getElementsByTagName('audio');

    Array.from(audioList).forEach(function (item) {
        if (item.getElementsByTagName('source')[0].getAttribute('src') === winnerTrack)
            item.play();
    });


}