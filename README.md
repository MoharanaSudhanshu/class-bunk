# क्लास बंक — Offline Music Player

## Folder structure

class-bunk/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── images/
    │   └── hero.jpg
    └── music/
        ├── midnight-notes-lofi.mp3
        ├── chai-and-codes.mp3
        ├── library-rain.mp3
        ├── lost-in-thoughts.mp3
        ├── hustle-dream.mp3
        └── late-night-city.mp3

## Add your songs

Copy your legally obtained/local MP3 files into:

assets/music/

Either rename them to the filenames above, or change the `file:` values in
script.js.

Example:
{file:"my-song.mp3", title:"My Song", artist:"My Artist"}

## Run

For a simple test, open index.html.

If the browser blocks local media/file behavior, run a local server:

Python:
python -m http.server 5500



The player uses the browser's HTML5 Audio API. No YouTube API is required.
