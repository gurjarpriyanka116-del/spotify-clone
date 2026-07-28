/*=================================
        DOM ELEMENTS
==================================*/

const search = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const cards = document.querySelectorAll(".searchable-card");
const noResults = document.getElementById("noResults");

const audioPlayer = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playPauseBtn");
const playIcon = playBtn.querySelector("i");

const prevSong = document.getElementById("prevSong");
const nextSong = document.getElementById("nextSong");

const progressBar = document.getElementById("progressBar");
const currentTime = document.getElementById("currentTime");
const volumeBar = document.getElementById("volumeBar");


const savedVolume = localStorage.getItem("playerVolume");

if (savedVolume !== null) {

    audioPlayer.volume = savedVolume;

    volumeBar.value = savedVolume * 100;

}

const songImage = document.getElementById("songImage");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");

const likeSong = document.getElementById("likeSong");

const visualizer = document.querySelector(".visualizer");

const playlistItems = document.querySelectorAll(".playlist-item");

/*=================================
        PREMIUM GLOBAL SEARCH
==================================*/

if (search) {

    search.addEventListener("keyup", function () {

        const value = this.value.toLowerCase().trim();

        let found = 0;

        cards.forEach(card => {

            const title = card.querySelector("h3")
                ? card.querySelector("h3").textContent.toLowerCase()
                : "";

            const description = card.querySelector("p")
                ? card.querySelector("p").textContent.toLowerCase()
                : "";

            if (
                title.includes(value) ||
                description.includes(value)
            ) {

                card.style.display = "";

                found++;

            } else {

                card.style.display = "none";

            }

        });

        if (noResults) {

            noResults.style.display =
                (found === 0 && value !== "") ? "block" : "none";

        }

    });

}
/*=================================
        CLEAR SEARCH BUTTON
==================================*/

clearSearch.addEventListener("click", function () {

    // Clear the search box
    search.value = "";

    // Run the search again
    search.dispatchEvent(new Event("keyup"));

    // Put the cursor back in the search box
    search.focus();

});

/* Loader */

window.addEventListener("load", () => {

    setTimeout(() => {

        document.querySelector(".loader").style.display = "none";

    }, 1800);

});

/* Active Sidebar */

const menuItems = document.querySelectorAll(".sidebar li");

menuItems.forEach(item=>{

    item.addEventListener("click",()=>{

        menuItems.forEach(menu=>{

            menu.classList.remove("active");

        });

        item.classList.add("active");

    });

});
/*===========================
    Back To Top Button
===========================*/

const backToTop = document.getElementById("backToTop");

backToTop.addEventListener("click", () => {

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

/*=================================
        REAL PLAY / PAUSE
==================================*/

let playing = false;

playBtn.addEventListener("click", function () {

    if (!playing) {

        audioPlayer.play();
		
		songImage.classList.add("playing");
		
		visualizer.classList.add("playing");

        playIcon.className = "fa-solid fa-pause";

        playing = true;

    } else {

        audioPlayer.pause();
		
		showToast("⏸️ Music Paused");

        playIcon.className = "fa-solid fa-play";
		
		songImage.classList.remove("playing");
		
		visualizer.classList.remove("playing");

        playing = false;

    }

});

/*=================================
        REAL PROGRESS BAR
==================================*/

audioPlayer.addEventListener("timeupdate", function () {

    if (!audioPlayer.duration) return;

    const progress =
        (audioPlayer.currentTime / audioPlayer.duration) * 100;

    progressBar.value = progress;

    const minutes =
        Math.floor(audioPlayer.currentTime / 60);

    const seconds =
        Math.floor(audioPlayer.currentTime % 60);

    currentTime.textContent =
        minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

});

/*=================================
        SEEK SONG
==================================*/

progressBar.addEventListener("input", function () {

    const seekTime =
        (progressBar.value / 100) * audioPlayer.duration;

    audioPlayer.currentTime = seekTime;

});
/*=================================
        SONG DURATION
==================================*/

audioPlayer.addEventListener("loadedmetadata", function () {

    const totalTime =
        document.querySelector(".progress-area span:last-child");

    const minutes =
        Math.floor(audioPlayer.duration / 60);

    const seconds =
        Math.floor(audioPlayer.duration % 60);

    totalTime.textContent =
        `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

});

volumeBar.addEventListener("input", function () {

    const volume = volumeBar.value / 100;

    audioPlayer.volume = volume;

    localStorage.setItem("playerVolume", volume);

});


/*=================================
        PLAYLIST
==================================*/

const playlist = [

    {
        title: "Today's Top Hits",
        artist: "Various Artists",
        image: "images/player/song1.png",
        audio: "audio/song1.mpeg"
    },

    {
        title: "Krishna Bhajan",
        artist: "Indresh Ji Upadhyay",
        image: "images/player/song2.png",
        audio: "audio/song2.mpeg"
    },

    {
        title: "Radha Krishna Bhajan",
        artist: "Poonam Didi",
        image: "images/player/song3.png",
        audio: "audio/song3.mpeg"
    },

    {
        title: "Shiv Bhajan",
        artist: "Devi Neha Saraswat",
        image: "images/player/song4.png",
        audio: "audio/song4.mpeg"
    }

];

let currentSong = 0;

/*=================================
        LOAD SONG
==================================*/

function loadSong(index) {

    currentSong = index;
	
	localStorage.setItem("lastSong", index);

    audioPlayer.src = playlist[index].audio;

    songImage.src = playlist[index].image;

    songTitle.textContent = playlist[index].title;

    songArtist.textContent = playlist[index].artist;
	
playlistItems.forEach(item => {

    item.classList.remove("active-song");

});

playlistItems[index].classList.add("active-song");

}

/*=================================
        NEXT SONG
==================================*/

nextSong.addEventListener("click", function () {

    currentSong++;

    if (currentSong >= playlist.length) {

        currentSong = 0;

    }

    loadSong(currentSong);

    audioPlayer.play();

    showToast("▶️ Playing Music");

    songImage.classList.add("playing");

    visualizer.classList.add("playing");

    playIcon.className = "fa-solid fa-pause";

});
	
	/*=================================
      RESTORE SAVED VOLUME
==================================*/


    audioPlayer.play();
	
	songImage.classList.add("playing");
	
	visualizer.classList.add("playing");

    playIcon.className = "fa-solid fa-pause";

/*=================================
        PREVIOUS SONG
==================================*/

prevSong.addEventListener("click", function () {

    currentSong--;

    if (currentSong < 0) {

        currentSong = playlist.length - 1;

    }

    loadSong(currentSong);

    audioPlayer.play();
	
	songImage.classList.add("playing");
	
	visualizer.classList.add("playing");

    playIcon.className = "fa-solid fa-pause";

});

/*=================================
        LOAD FIRST SONG
==================================*/

const savedSong = localStorage.getItem("lastSong");

if (savedSong !== null) {

    currentSong = Number(savedSong);

}

loadSong(currentSong);

/*=================================
        AUTO NEXT SONG
==================================*/

audioPlayer.addEventListener("ended", function () {

    if (repeatMode) {

        audioPlayer.currentTime = 0;

        audioPlayer.play();
		
		showToast("▶️ Playing Music");
		
		songImage.classList.add("playing");
		
		visualizer.classList.add("playing");

        return;

    }

    if (shuffleMode) {

        currentSong = Math.floor(Math.random() * playlist.length);

    } else {

        currentSong++;

        if (currentSong >= playlist.length) {

            currentSong = 0;

        }

    }

    loadSong(currentSong);

    audioPlayer.play();
	
	songImage.classList.add("playing");
	
	visualizer.classList.add("playing");

    playIcon.className = "fa-solid fa-pause";

});
/*=================================
        LIKE BUTTON
==================================*/

let liked = false;

likeSong.addEventListener("click", function () {

    liked = !liked;

    const icon = likeSong.querySelector("i");

    if (liked) {
		
		showToast("❤️ Added to Liked Songs");

        icon.classList.remove("fa-regular");

        icon.classList.add("fa-solid");

    } else {
		
		showToast("💔 Removed from Liked Songs");

        icon.classList.remove("fa-solid");

        icon.classList.add("fa-regular");

    }

});

/*=================================
        SHUFFLE BUTTON
==================================*/

const shuffleBtn = document.querySelector(".fa-shuffle").parentElement;

let shuffleMode = false;

shuffleBtn.addEventListener("click", function () {

    shuffleMode = !shuffleMode;

    if (shuffleMode) {
		
		showToast("🔀 Shuffle Enabled");

        shuffleBtn.style.color = "#1DB954";

    } else {
		
		showToast("➡️ Shuffle Disabled");

        shuffleBtn.style.color = "";

    }

});

/*=================================
        REPEAT BUTTON
==================================*/

const repeatBtn =
document.querySelector(".fa-repeat").parentElement;

let repeatMode = false;

repeatBtn.addEventListener("click", function () {

    repeatMode = !repeatMode;

    if (repeatMode) {
		
		showToast("🔁 Repeat Enabled");

        repeatBtn.style.color = "#1DB954";

    } else {
		
		showToast("➡️ Repeat Disabled");

        repeatBtn.style.color = "";

    }

});

/*=================================
        PLAYLIST CLICK
==================================*/

playlistItems.forEach(item => {

    item.addEventListener("click", function () {

        currentSong = Number(this.dataset.index);

        loadSong(currentSong);

        audioPlayer.play();
		
		showToast("▶️ Playing Music");
		
		songImage.classList.add("playing");
		
		visualizer.classList.add("playing");

        playIcon.className = "fa-solid fa-pause";
		
		songImage.classList.add("playing");

        playlistItems.forEach(song => {

            song.classList.remove("active-song");

        });

        this.classList.add("active-song");

    });

});

/*=================================
        TOAST NOTIFICATION
==================================*/

const toast = document.getElementById("toast");

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toast.timer);

    toast.timer = setTimeout(function () {

        toast.classList.remove("show");

    }, 2500);

}
