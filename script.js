let currentSong = new Audio();
let play = document.getElementById("play")
let previous = document.getElementById("previous");
let next = document.getElementById("next");
let playing = false;
let songs;
var listen2 = document.querySelectorAll(".cardContainer .card")

async function getSongs() {
    let url = await fetch("/songs/");
    let response = await url.text();
    let div = document.createElement("div");
    div.innerHTML = response; // Correct usage of innerHTML
    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }

    return songs;
}

const playMusic = (song, artist) => {
    playing = true
    // var audio = new Audio(`/songs/${song}${artist}.mp3`)
    currentSong.src = `/songs/${song}${artist}.mp3`
    currentSong.play()
    play.src = "pause.svg"
}

async function formatSecondsToMinutes(seconds) {
    // Ensure seconds is an integer
    const totalSeconds = Math.floor(seconds);

    // Calculate the minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    // Pad with leading zeros if necessary
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');

    // Combine minutes and seconds into the desired format
    return `${paddedMinutes}:${paddedSeconds}`;
}


async function main() {
    songs = await getSongs();
    new_song = []

    var songUl = document.querySelector(".songList")

    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `
        <li>
            <div class="upper">
                <img src="music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ").split("-")[0]}</div>
                    <div class="artist">-${song.split("-")[1].split(".")[0].replaceAll("%20", ' ')}</div>
                </div>
            </div>
            <div class="playNow">
                <img width = 28px src="playSong.svg" alt="">
            </div>  
     </li>`
    }

    var listen = document.querySelectorAll(".songList li")
    // console.log(listen)
    for (let i = 0; i < listen.length; i++) {
        document.querySelector(".songInfo").innerHTML = `${listen[0].querySelector(".info>div").innerHTML}.mp3`
        document.querySelector(".duration").innerHTML = `00:00/03:45`
        listen[i].addEventListener('click', element => {
            console.log(listen[i].querySelector(".artist").innerHTML)
            playMusic(listen[i].querySelector(".info>div").innerHTML, listen[i].querySelector(".artist").innerHTML)
            listen[i].style.backgroundColor = "#2a2a2a"
            listen[i].querySelector(".playNow>img").src = "pause.svg";
            document.querySelector(".songInfo").innerHTML = `${listen[i].querySelector(".info>div").innerHTML}.mp3`
            for (let j = 0; j < listen.length; j++) {
                if (j != i) {
                    listen[j].style.backgroundColor = "#121212";
                    listen[j].querySelector(".playNow>img").src = "playSong.svg";
                }
            }

        })


        play.addEventListener('click', () => {
            if (playing == false) {
                listen[0].style.backgroundColor = "#2a2a2a"
                listen2[0].style.backgroundColor = "#2a2a2a"
                playMusic(listen[0].querySelector(".info>div").innerHTML, listen[0].querySelector(".artist").innerHTML)
                listen[0].querySelector(".playNow>img").src = "pause.svg";
                document.querySelector(".songInfo").innerHTML = `${listen[0].querySelector(".info>div").innerHTML}.mp3`
            }
            else {

                if (currentSong.paused) {
                    currentSong.play();
                    // console.log(currentSong)
                    play.src = "pause.svg";
                    playing = true;
                }
                else {
                    currentSong.pause()
                    play.src = "playsong.svg"
                    playing = true;
                }
            }
        })

        // listen for time update

        currentSong.addEventListener("timeupdate", async () => {
            // console.log(currentSong.currentTime, currentSong.duration);
            let minLeft = await formatSecondsToMinutes(currentSong.currentTime);
            let time = await formatSecondsToMinutes(currentSong.duration)
            if (time.charAt(0) == 'N')
                document.querySelector(".duration").innerHTML = "00:00/00:00";
            else
                document.querySelector(".duration").innerHTML = `${minLeft}/${time}`

            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
            let grnWidth = document.querySelector(".seekgrn").style.width = (currentSong.currentTime / currentSong.duration) * 98 + "%";
        })

        // add event listener to seekbar
        document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = (percent) + "%";
            currentSong.currentTime = (currentSong.duration * percent) / 100
            console.log(currentSong.currentTime, currentSong.duration)
        })

        document.querySelector(".seekgrn").addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = (percent) + "%";
            currentSong.currentTime = (currentSong.duration * percent) / 100
            console.log(currentSong.currentTime, currentSong.duration)
        })
    }
    let hamburger = document.querySelector(".hamburger");
    hamburger.addEventListener("click", e => {
        document.querySelector(".left").style.left = 0
    })

    let cross = document.querySelector(".cross");
    cross.addEventListener("click", e => {
        document.querySelector(".left").style.left = "-100%"
    })

    // play next and previous songs

    previous.addEventListener("click", () => {
        // playMusic(listen[i].querySelector(".info>div").innerHTML, listen[i].querySelector(".artist").innerHTML)


        // console.log(currentSong.src.split("/").slice(-1))
        let parts = currentSong.src.split("/");
        const filename = parts[parts.length - 1];
        const songName = filename.substring(0, filename.lastIndexOf('.'));
        console.log(songName)
        var index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs)
        console.log(songs[index])
        if (index == 0) {
            // document.querySelector(".songInfo").innerHTML = `${listen[i].querySelector(".info>div").innerHTML}.mp3`
            var withoutmp3 = songs[index].slice(0, songs[index].length - 4)
            var prevSong = withoutmp3.split("-")[0];
            let prevArtist = "-" + withoutmp3.split("-")[1];
            playMusic(prevSong, prevArtist)
            document.querySelector(".songInfo").innerHTML = prevSong.replaceAll("%20", " ") + ".mp3"
        }
        else {
            var withoutmp3 = songs[index - 1].slice(0, songs[index - 1].length - 4)
            var prevSong = withoutmp3.split("-")[0];
            let prevArtist = "-" + withoutmp3.split("-")[1];

            playMusic(prevSong, prevArtist)
            document.querySelector(".songInfo").innerHTML = prevSong.replaceAll("%20", " ") + ".mp3"
        }
        listen[index - 1].style.backgroundColor = "#2a2a2a"
        listen[index - 1].querySelector(".playNow>img").src = "pause.svg";
        listen[index].style.backgroundColor = "#121212";
        listen[index].querySelector(".playNow>img").src = "playSong.svg";

        console.log(listen2[index - 1])
        listen2[index - 1].style.backgroundColor = "#2b2b2b"
        // listen[index-1].querySelector(".playNow>img").src = "pause.svg";
        listen2[index].style.backgroundColor = "#121212";
        // listen[index].querySelector(".playNow>img").src = "playSong.svg";
    })
    next.addEventListener("click", () => {
        // console.log(currentSong.src.split("/").slice(-1))
        let parts = currentSong.src.split("/");
        const filename = parts[parts.length - 1];
        const songName = filename.substring(0, filename.lastIndexOf('.'));
        console.log(songName)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index == songs.length - 1) {
            // document.querySelector(".songInfo").innerHTML = `${listen[i].querySelector(".info>div").innerHTML}.mp3`
            var withoutmp3 = songs[index].slice(0, songs[index].length - 4)
            var nxtSong = withoutmp3.split("-")[0];
            let nxtArtist = "-" + withoutmp3.split("-")[1];
            playMusic(nxtSong, nxtArtist)
            document.querySelector(".songInfo").innerHTML = nxtSong.replaceAll("%20", " ") + ".mp3"
        }
        else {
            var withoutmp3 = songs[index + 1].slice(0, songs[index + 1].length - 4)
            var nxtSong = withoutmp3.split("-")[0];
            let nxtArtist = "-" + withoutmp3.split("-")[1];

            playMusic(nxtSong, nxtArtist)
            document.querySelector(".songInfo").innerHTML = nxtSong.replaceAll("%20", " ") + ".mp3"
        }
        listen[index + 1].style.backgroundColor = "#2a2a2a"
        listen[index + 1].querySelector(".playNow>img").src = "pause.svg";
        listen[index].style.backgroundColor = "#121212";
        listen[index].querySelector(".playNow>img").src = "playSong.svg";

        listen2[index + 1].style.backgroundColor = "#2b2b2b"
        // listen[index - 1].querySelector(".playNow>img").src = "pause.svg";
        listen2[index].style.backgroundColor = "#121212";
        // listen[index].querySelector(".playNow>img").src = "playSong.svg";
    })

    // adjustable volume
    document.getElementById("or").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })


    for (let i = 0; i < listen2.length; i++) {
        listen2[i].addEventListener("click", () => {
            playMusic(listen[i].querySelector(".info>div").innerHTML, listen[i].querySelector(".artist").innerHTML)
            listen[i].style.backgroundColor = "#2a2a2a"
            listen2[i].style.backgroundColor = "#2b2b2b";
            listen[i].querySelector(".playNow>img").src = "pause.svg";
            document.querySelector(".songInfo").innerHTML = `${listen[i].querySelector(".info>div").innerHTML}.mp3`
            for (let j = 0; j < listen.length; j++) {
                if (j != i) {
                    console.log("yay")
                    listen2[j].style.backgroundColor = "#121212";
                    listen[j].style.backgroundColor = "#121212";
                    listen[j].querySelector(".playNow>img").src = "playSong.svg";

                }
            }
        })

    }

    document.getElementById("vol").addEventListener("click", () => {
        if (document.getElementById("or").value > 0) {
            document.querySelector(".volume img").src = "noVolume.svg"
            document.getElementById("or").value = 0
        }
        else {
            document.querySelector(".volume img").src = "volume.svg"
            document.getElementById("or").value = 100
        }
    })



}



main();
