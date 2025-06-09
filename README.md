# 🎶 BeatWave

[![GitHub last commit](https://img.shields.io/badge/GitHub%20last%20commit-main-blue)](https://github.com/vrajchariot/BeatWave/commits/main)

BeatWave is a sleek, web-based music player application designed to provide a seamless audio experience. It allows users to effortlessly browse, search, and play songs with a visually appealing interface and intuitive controls, optimized for various devices.

## 🌟 About the Project

This project was developed to showcase a modern, responsive web application that handles dynamic content loading and user interactions for media playback. It simulates a music streaming experience, allowing users to discover and enjoy music directly from their browser, complete with essential playback features and an interactive seekbar.

## ✨ Features

* **Song Library:** Browse through a dynamically loaded list of songs.
* **Search Functionality:** Easily search for songs by title or artist.
* **Interactive Seekbar:** Drag or click to precisely seek within any song's playback.
* **Responsive Design:** Fully optimized interface for seamless use on both desktop and mobile devices.
* **Play Controls:** Intuitive buttons for play, pause, previous, next, and song navigation.
* **Custom UI Controls:** Engineered custom audio player with dynamic DOM manipulation for a unique user experience.

## 📂 Project Structure
```
BeatWave/
├── images/             # Contains all image assets (icons, logos, etc.)
├── songs/              # Contains song folders with metadata and audio files
│   ├── &lt;song_name>/    # Each song folder contains info.json and media files
│   └── ...
├── index.html          # Main HTML file, structure of the player
├── style.css           # CSS file for comprehensive styling and responsive design
└── script.js           # JavaScript file handling all core functionality and interactions
```
## 🚀 Installation

To get BeatWave up and running on your local machine, follow these simple steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/vrajchariot/BeatWave.git](https://github.com/vrajchariot/BeatWave.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd BeatWave
    ```
3.  **Open `index.html` in your browser:**
    ```bash
    open index.html
    # Or simply double-click 'index.html' in your file explorer
    ```

## 🎵 Usage

Once installed, BeatWave provides an intuitive interface for music playback:

* **Song Library:** Songs are dynamically fetched from the `songs/` directory. Each song folder contains an `info.json` file with its metadata (title, artist, description, image, and audio).
* **Search Functionality:** Use the integrated search bar to filter songs by title or artist. Click the close button to clear the search.
* **Play Controls:** Use the play/pause button to toggle playback. Navigate to the previous or next song using the respective navigation buttons.
* **Seekbar:** Drag or click on the seekbar to jump to any specific part of the song. The seekbar updates in real-time.
* **Responsive Experience:** On mobile, the sidebar is hidden by default and accessible via the hamburger menu. Controls are optimized for smaller screens.

## 📝 Code Documentation (High-Level)

The core logic of BeatWave resides in `script.js`.

### Global Variables

* `currentSongIndex`: Tracks the index of the currently playing song in `songsList`.
* `songsList`: Stores the list of all songs fetched dynamically.
* `isPlaying`: Boolean flag to indicate current playback state (play/pause).
* `currentAudio`: Reference to the HTML Audio object for the playing song.
* `initialSongInfo`: Metadata of the first song loaded on startup.
* `isDragging`: Boolean to track if the seekbar is being dragged.
* `draggedTime`: Stores the time corresponding to the dragged seekbar position.

### Key Functions

* `fetchSongsList()`: Retrieves song data, either via GitHub API (for a dynamic library) or a local fallback.
* `fetchSongInfo(songName)`: Fetches `info.json` metadata for a given song.
* `updateSeekbarInfo(songInfo, audio)`: Updates UI elements like seekbar progress, song details, and timestamps.
* `formatTime(seconds)`: Utility function to format time into `MM:SS`.
* `playSong(index)`: Core playback function; loads, plays, updates UI, and manages audio events.
* `setupControls()`: Initializes event listeners for all playback controls and seekbar interactions.
* `updateSeekPosition(offsetX, totalWidth)`: Calculates and updates the seekbar position and corresponding timestamp during user interaction.
* `displaySongs()`: Renders the song list in both library and grid views, setting up playback click events.

### Event Listeners

Event listeners are set up for the search button, close search button, search input field, hamburger menu (for mobile navigation), and all playback controls and seekbar elements.

## 🎶 Metadata Format (`info.json`)

Each song in the `songs/` directory must have an `info.json` file structured as follows:

```json
{
    "title": "Song Title",
    "artist": "Artist Name",
    "description": "Brief description of the song.",
    "image": "cover_image.jpeg",
    "audio": "audio_file.mp3"
}
```
### Responsive Design
BeatWave is built with a mobile-first approach, ensuring a great experience across all devices:

* **Desktop:** Sidebar and main content are displayed side-by-side, offering full functionality.
* **Mobile:** The sidebar is hidden by default, accessible via a hamburger menu. Controls are optimized for smaller screens.

### Credits
* **Developer:** Vraj Shah
* * **Email:** [Vraj0410shah@gmail.com](mailto:Vraj0410shah@gmail.com)
* **Icons:** FontAwesome
* **Fonts:** Google Fonts - Poppins

Feel free to reach out for any questions or suggestions!
