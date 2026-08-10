/* =========================================================
   FIREBASE CONFIGURATION
========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyAwGBrUXaU93GSXzq5P8G5SdyeAPxYHxiw",
    authDomain: "class-bunk-6fbe3.firebaseapp.com",
    databaseURL: "https://class-bunk-6fbe3-default-rtdb.firebaseio.com",
    projectId: "class-bunk-6fbe3",
    storageBucket: "class-bunk-6fbe3.firebasestorage.app",
    messagingSenderId: "750517348285",
    appId: "1:750517348285:web:955cfa1e35b112015f14d4",
    measurementId: "G-JWQCZ3DEGC"
};


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();


/* =========================================================
   REALTIME VISITOR COUNT
========================================================= */

async function startPresence() {

    try {

        // Anonymous login
        const userCredential =
            await auth.signInAnonymously();

        const uid =
            userCredential.user.uid;

        console.log(
            "Firebase visitor connected:",
            uid
        );


        // Create a unique presence record
        const visitorRef =
            database.ref(
                "presence/" + uid
            );


        // Firebase connection status
        const connectedRef =
            database.ref(
                ".info/connected"
            );


        connectedRef.on(
            "value",
            snapshot => {

                if (
                    snapshot.val() !== true
                ) {
                    return;
                }


                /*
                Automatically remove this
                visitor when they disconnect.
                */

                visitorRef
                    .onDisconnect()
                    .remove();


                /*
                Register visitor
                */

                visitorRef.set({
                    connectedAt:
                        firebase.database.ServerValue.TIMESTAMP
                });

            }
        );


        /*
        Listen for realtime changes
        */

        database
            .ref("presence")
            .on(
                "value",
                snapshot => {

                    const count =
                        snapshot.numChildren();


                    /*
                    Your HTML should contain:
                    id="listeners"
                    */

                    const listenerElement =
                        document.getElementById(
                            "listeners"
                        );


                    if (listenerElement) {

                        listenerElement.textContent =
                            count;

                    }


                    /*
                    Also supports:
                    id="listenerCount"
                    */

                    const listenerCountElement =
                        document.getElementById(
                            "listenerCount"
                        );


                    if (
                        listenerCountElement
                    ) {

                        listenerCountElement.textContent =
                            count;

                    }


                    console.log(
                        "Live visitors:",
                        count
                    );

                }
            );


    } catch (error) {

        console.error(
            "Firebase presence error:",
            error
        );

    }

}


startPresence();


/* =========================================================
   MUSIC PLAYLIST
========================================================= */

const tracks = [

    {
        file: "midnight-notes-lofi.mp3",
        title: "Midnight Notes",
        artist: "Lofi • Class Bunk"
    },

    {
        file: "chai-and-codes.mp3",
        title: "Chai & Codes",
        artist: "Lofi • Study"
    },

    {
        file: "library-rain.mp3",
        title: "Library Rain",
        artist: "Rain • Focus"
    },

    {
        file: "lost-in-thoughts.mp3",
        title: "Lost in Thoughts",
        artist: "Chill • Late Night"
    },

    {
        file: "hustle-dream.mp3",
        title: "Hustle & Dream",
        artist: "Focus • Motivation"
    },

    {
        file: "late-night-city.mp3",
        title: "Late Night City",
        artist: "Lofi • Night Ride"
    }

];


let index = 0;

let shuffle = false;


/* =========================================================
   AUDIO
========================================================= */

const audio = new Audio();

audio.preload = "metadata";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const $ = id =>
    document.getElementById(id);


const play =
    $("play");

const topPlay =
    $("topPlay");

const fill =
    $("fill");

const current =
    $("current");

const duration =
    $("duration");

const title =
    $("title");

const artist =
    $("artist");

const album =
    $("album");

const tracksBox =
    $("tracks");


/* =========================================================
   FORMAT TIME
========================================================= */

function fmt(sec) {

    if (
        !Number.isFinite(sec)
    ) {

        return "0:00";

    }


    sec =
        Math.floor(sec);


    return (
        `${Math.floor(sec / 60)}:` +
        `${String(sec % 60).padStart(2, "0")}`
    );

}


/* =========================================================
   RENDER PLAYLIST
========================================================= */

function renderTracks() {

    if (!tracksBox) {
        return;
    }


    tracksBox.innerHTML = "";


    tracks.forEach(
        (track, i) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "track" +
                (
                    i === index
                        ? " active"
                        : ""
                );


            row.innerHTML = `
                <div>
                    <b>${track.title}</b>
                    <small>${track.artist}</small>
                </div>

                <time>MP3</time>
            `;


            row.onclick =
                () => load(i, true);


            tracksBox.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   LOAD SONG
========================================================= */

function load(
    i,
    autoplay = false
) {

    index =
        (
            i + tracks.length
        ) %
        tracks.length;


    const track =
        tracks[index];


    audio.src =
        `assets/music/${track.file}`;


    title.textContent =
        track.title;


    artist.textContent =
        track.artist;


    /*
    Make sure this file actually exists.

    If your generated artwork is hero.jpg,
    change this to:

    assets/images/hero.jpg
    */

    album.src =
        "assets/images/hero.png";


    renderTracks();


    fill.style.width =
        "0%";


    current.textContent =
        "0:00";


    duration.textContent =
        "0:00";


    if (autoplay) {

        audio
            .play()
            .catch(error => {

                console.error(
                    "Audio playback error:",
                    error
                );

                alert(
                    "Please make sure the MP3 file exists inside assets/music/"
                );

            });

    }

}


/* =========================================================
   PLAY / PAUSE ICON
========================================================= */

function setIcon() {

    const playing =
        !audio.paused;


    play.textContent =
        playing
            ? "Ⅱ"
            : "▶";


    if (topPlay) {

        topPlay.textContent =
            playing
                ? "Ⅱ"
                : "▶";

    }

}


/* =========================================================
   PLAY / PAUSE
========================================================= */

function toggle() {

    if (
        audio.paused
    ) {

        audio
            .play()
            .catch(error => {

                console.error(
                    "Playback error:",
                    error
                );

                alert(
                    "Put your MP3 files inside assets/music/"
                );

            });

    } else {

        audio.pause();

    }

}


if (play) {

    play.onclick =
        toggle;

}


if (topPlay) {

    topPlay.onclick =
        toggle;

}


/* =========================================================
   NEXT
========================================================= */

const nextButton =
    $("next");


if (nextButton) {

    nextButton.onclick =
        () => {

            if (shuffle) {

                let randomIndex;


                do {

                    randomIndex =
                        Math.floor(
                            Math.random() *
                            tracks.length
                        );

                } while (
                    randomIndex === index &&
                    tracks.length > 1
                );


                index =
                    randomIndex;

            } else {

                index++;

            }


            load(
                index,
                true
            );

        };

}


/* =========================================================
   PREVIOUS
========================================================= */

const previousButton =
    $("prev");


if (previousButton) {

    previousButton.onclick =
        () => {

            load(
                index - 1,
                true
            );

        };

}


/* =========================================================
   SHUFFLE
========================================================= */

const shuffleButton =
    $("shuffle");


if (shuffleButton) {

    shuffleButton.onclick =
        () => {

            shuffle =
                !shuffle;


            shuffleButton.style.color =
                shuffle
                    ? "#ff8b6b"
                    : "";

        };

}


/* =========================================================
   AUDIO METADATA
========================================================= */

audio.addEventListener(
    "loadedmetadata",
    () => {

        if (duration) {

            duration.textContent =
                fmt(audio.duration);

        }

    }
);


/* =========================================================
   AUDIO PROGRESS
========================================================= */

audio.addEventListener(
    "timeupdate",
    () => {

        if (current) {

            current.textContent =
                fmt(audio.currentTime);

        }


        if (
            fill &&
            audio.duration
        ) {

            fill.style.width =
                `${(
                    audio.currentTime /
                    audio.duration
                ) * 100}%`;

        }

    }
);


/* =========================================================
   PLAY / PAUSE EVENTS
========================================================= */

audio.addEventListener(
    "play",
    setIcon
);


audio.addEventListener(
    "pause",
    setIcon
);


/* =========================================================
   SONG ENDED
========================================================= */

audio.addEventListener(
    "ended",
    () => {

        if (shuffle) {

            let randomIndex;


            do {

                randomIndex =
                    Math.floor(
                        Math.random() *
                        tracks.length
                    );

            } while (
                randomIndex === index &&
                tracks.length > 1
            );


            index =
                randomIndex;

        } else {

            index++;

        }


        load(
            index,
            true
        );

    }
);


/* =========================================================
   PROGRESS BAR SEEKING
========================================================= */

const progress =
    $("progress");


if (progress) {

    progress.onclick =
        event => {

            if (
                !audio.duration
            ) {

                return;

            }


            const rect =
                event.currentTarget
                    .getBoundingClientRect();


            const percentage =
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width;


            audio.currentTime =
                audio.duration *
                percentage;

        };

}


/* =========================================================
   MOOD BUTTONS
========================================================= */

document
    .querySelectorAll(
        ".mood"
    )
    .forEach(
        button => {

            button.onclick =
                () => {

                    document
                        .querySelectorAll(
                            ".mood"
                        )
                        .forEach(
                            item =>
                                item.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    button.classList.add(
                        "active"
                    );


                    const mood =
                        button.dataset.mood;


                    if (
                        mood === "lofi"
                    ) {

                        artist.textContent =
                            "Lofi • Class Bunk";

                    }


                    if (
                        mood === "bollywood"
                    ) {

                        artist.textContent =
                            "Bollywood Chill • Class Bunk";

                    }


                    if (
                        mood === "phonk"
                    ) {

                        artist.textContent =
                            "Phonk Focus • Class Bunk";

                    }

                };

        }
    );


/* =========================================================
   LIVE CLOCK
========================================================= */

function clock() {

    const d =
        new Date();


    const clockElement =
        $("clock");


    if (!clockElement) {
        return;
    }


    clockElement.textContent =
        d
            .toLocaleTimeString(
                [],
                {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                }
            )
            .toLowerCase();

}


clock();


setInterval(
    clock,
    1000
);


/* =========================================================
   INITIALIZE MUSIC PLAYER
========================================================= */

renderTracks();

load(
    0,
    false
);