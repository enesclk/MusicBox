// Make connection
var socket = io.connect('http://localhost:4000');

var timeStopped = false;

//Todo: Our code starts here..


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


const allMusics = firebase.database().ref('musics');

allMusics.once("value") // Client timer başladıktan sonra bağlanırsa güncel değerleri database'den alıyor.
    .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var val = childSnapshot.val();
            var id = "";

            if (key == "Alan Walker - Fade")
                id = "music_1";
            else if (key == "Lensko - Let's Go!")
                id = "music_2";
            else if (key == "Lensko - Cetus")
                id = "music_3";
            else if (key == "JJD - Adventure")
                id = "music_4";

            var div = document.getElementById(id);
            var span = div.querySelectorAll(".count");

            span[0].innerHTML = val; // span[0] olarak kullanmak gerekiyor. Çünkü querySelectorAll geriye bir dizi döndürüyor. Biz dizinin ilk elemanını alıyoruz.

        });
    });



function upvote(id) { //HTML'den direk olarak tetikleniyor. Heart iconlarına tıklandığı zaman çalışıyor.

    if (!timeStopped) {

        console.log(id);
        var div = document.getElementById(id);
        var songNameSpan = document.getElementById(id).parentNode.querySelectorAll("span");

        var song = songNameSpan[0].innerHTML; //tıklanan heart iconunun parent divinin ilk span elemanı; yani şarkının ismi.
        console.log(song);

        var span = div.querySelectorAll(".count"); //tıklanan heart iconunun içindeki upvote değeri
        var count = span[0].innerHTML;


        var songName = song.replace("[NoCopyRightSounds] ","");
        console.log(songName);

        var firebaseSongRef = allMusics.child("/"+songName);
        var songUpvoteValue = 0;


        firebaseSongRef.on("value", snap => {
            console.log(snap.val());
            songUpvoteValue = snap.val();
        });

        songUpvoteValue++;

        data = {[songName]: songUpvoteValue};

        allMusics.update(data);

        socket.emit('upvoting', { //Serverın yakalaması için bu event oluşturuldu.
            upvoteCount: count,
            upvotedTrack: id
        });
        span[0].innerHTML++;
        span[0].style.color = 'blue';
    }
}

socket.on('upvoting', function(data){ //socket.emit'ten farklı olarak bu fonksiyon server tarafından upvoting event'i tetiklendiğinde çalışıyor.
    var div = document.getElementById(data.upvotedTrack);
    var span = div.querySelectorAll(".count");
    span[0].innerHTML++;
});

socket.on('timer', function(data) {
    var div = document.getElementsByClassName('timer')[0]; // Çok elemanlı dizi döndürüyor. "[0]" şeklinde elemanları teker teker çağırmamız gerek.

    div.innerHTML = "Kalan süre: "+data.countdown+" sn";
});


socket.on('endOfTime', function (data) {

    timeStopped = true;

    var listOfTracks_div = document.getElementsByClassName('heart');

    var listOfTracks_span = [];


    Array.from(listOfTracks_div).forEach(item => {
        var span = item.querySelectorAll(".count")[0];
        listOfTracks_span.push(span);
        console.log(span);
    });

    var winnerTrack = listOfTracks_span[0];

    listOfTracks_span.forEach(function (item) { //En çok oyu alan şarkıyı bulmak için döngüyü oluşturdum.
        if (item.innerHTML > winnerTrack.innerHTML)
            winnerTrack = item;
    });

    var outerDiv = winnerTrack.parentNode.parentNode; // En dıştaki (awesome-list-item) dive gidiyor.
    var winner = outerDiv.getElementsByTagName('span')[0].innerHTML; // Kazanan şarkının adını alıyoruz.

    playMusic(winner);

    var playingMusic = document.getElementsByClassName('notification')[0];

    playingMusic.innerHTML = "Çalan müzik : "+winner;

    //alert("Çalan müzik : "+winner);

});

/*

function resetTimer() {
    socket.emit('resetTimer');
}

*/

function playMusic(winnerTrack) {

    winnerTrack += ".mp3";

    audioList = document.getElementsByTagName('audio');

    Array.from(audioList).forEach(function (item) {
        if (item.getElementsByTagName('source')[0].getAttribute('src') === winnerTrack)
            item.play();
    });


}