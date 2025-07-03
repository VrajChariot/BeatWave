let currentSongIndex = 0;
let songsList = [];
let isPlaying = false;
let currentAudio = null;
let initialSongInfo = null;
let isDragging = false;
let draggedTime = 0;

async function fetchSongsList() {
  try {
    const response = await fetch(
      "https://api.github.com/repos/vrajchariot/BeatWave/contents/songs"
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (!Array.isArray(data)) {
      throw new Error("Expected array from GitHub API");
    }

    let filter_songs = data
      .filter((item) => item.type === "dir")
      .map((dir) => dir.name);
    console.log("Filtered songs:", filter_songs);
    return filter_songs;
  } catch (error) {
    console.error("Error fetching songs list:", error);
    // Fallback to local song list if API fails
    return ["blinding lights", "Perfect", "Replay", "Right Round", "Stay"];
  }
}

async function fetchSongInfo(songName) {
  try {
    const response = await fetch(`songs/${songName}/info.json`);
    const data = await response.json();
    // this will log the info.json file for each song
    console.log(data);
    return { ...data, folder: songName };
  } catch (error) {
    console.error(`Error fetching info for ${songName}:`, error);
    return null;
  }
}

// Modify updateSeekbarInfo function
function updateSeekbarInfo(songInfo, audio) {
  const seekBarSongName = document.querySelector(".seekBar_songName");
  const seekBarArtistName = document.querySelector(".seekBar_artistName");
  const timeStamp = document.querySelector(".timeStamp span");
  const pauseControl = document.querySelector(".pause_control");
  const seekbarFill = document.querySelector(".seekbar_fill");

  seekBarSongName.textContent = songInfo.title;
  seekBarArtistName.textContent = songInfo.artist;

  // Add loadedmetadata event listener
  audio.addEventListener("loadedmetadata", () => {
    const duration = formatTime(audio.duration);
    timeStamp.textContent = `0:00 / ${duration}`;
  });

  // Update play/pause button and timestamp
  audio.addEventListener("timeupdate", () => {
    if (!isDragging && !isNaN(audio.duration)) {
      const progress = (audio.currentTime / audio.duration) * 100;
      seekbarFill.style.width = `${progress}%`;

      // Update timestamp
      const currentTime = formatTime(audio.currentTime);
      const duration = formatTime(audio.duration);
      timeStamp.textContent = `${currentTime} / ${duration}`;
    }
  });

  pauseControl.src = isPlaying ? "./images/pause.svg" : "./images/play_now.svg";
}

// Make sure formatTime handles invalid input
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Modify the play function to handle all audio controls
async function playSong(index) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  document.querySelectorAll(".song_info").forEach((song) => {
    song.classList.remove("active");
  });

  // Add active class to currently playing song
  const songElements = document.querySelectorAll(".song_info");
  songElements[index].classList.add("active");

  const songInfo = await fetchSongInfo(songsList[index]);
  const audio = new Audio(`songs/${songInfo.folder}/${songInfo.audio}`);

  audio.addEventListener("ended", () => {
    if (currentSongIndex < songsList.length - 1) {
      playSong(currentSongIndex + 1);
    }
  });

  audio.play();
  currentAudio = audio;
  currentSongIndex = index;
  isPlaying = true;

  updateSeekbarInfo(songInfo, audio);
  console.log(`Playing ${songInfo.title} by ${songInfo.artist}`);
}

// Add event listeners for control buttons
function setupControls() {
  const previousButton = document.querySelector(".previous_control");
  const nextButton = document.querySelector(".next_control");
  const pauseButton = document.querySelector(".pause_control");
  const seekbar = document.querySelector(".seekbar");

  previousButton.addEventListener("click", () => {
    if (currentSongIndex > 0) {
      playSong(currentSongIndex - 1);
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentSongIndex < songsList.length - 1) {
      playSong(currentSongIndex + 1);
    }
  });

  pauseButton.addEventListener("click", () => {
    if (!currentAudio && initialSongInfo) {
      // First time play
      playSong(0);
    } else if (currentAudio) {
      if (isPlaying) {
        currentAudio.pause();
        pauseButton.src = "./images/play_now.svg";
      } else {
        currentAudio.play();
        pauseButton.src = "./images/pause.svg";
      }
      isPlaying = !isPlaying;
    }
  });

  seekbar.addEventListener("click", (e) => {
    if (currentAudio) {
      const seekbarWidth = seekbar.offsetWidth;
      const clickPosition = e.offsetX;
      const seekTime = (clickPosition / seekbarWidth) * currentAudio.duration;
      currentAudio.currentTime = seekTime;
    }
  });

  // Mouse events
  seekbar.addEventListener("mousedown", (e) => {
    isDragging = true;
    updateSeekPosition(e.offsetX, seekbar.offsetWidth);
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const rect = seekbar.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      updateSeekPosition(offsetX, seekbar.offsetWidth);
    }
  });

  document.addEventListener("mouseup", (e) => {
    if (isDragging && currentAudio) {
      const rect = seekbar.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      isDragging = false;
      updateSeekPosition(offsetX, seekbar.offsetWidth);
    }
  });

  // Touch events
  seekbar.addEventListener("touchstart", (e) => {
    isDragging = true;
    const rect = seekbar.getBoundingClientRect();
    const offsetX = e.touches[0].clientX - rect.left;
    updateSeekPosition(offsetX, seekbar.offsetWidth);
  });

  seekbar.addEventListener("touchmove", (e) => {
    if (isDragging) {
      const rect = seekbar.getBoundingClientRect();
      const offsetX = e.touches[0].clientX - rect.left;
      updateSeekPosition(offsetX, seekbar.offsetWidth);
    }
  });

  seekbar.addEventListener("touchend", (e) => {
    isDragging = false;
    if (currentAudio) {
      const rect = seekbar.getBoundingClientRect();
      const offsetX = e.changedTouches[0].clientX - rect.left;
      updateSeekPosition(offsetX, seekbar.offsetWidth);
    }
  });

  // Add this helper function
  function updateSeekPosition(offsetX, totalWidth) {
    if (currentAudio) {
      const percentage = Math.min(Math.max(offsetX / totalWidth, 0), 1);
      draggedTime = percentage * currentAudio.duration;

      // Update visual elements only
      const seekbarFill = document.querySelector(".seekbar_fill");
      seekbarFill.style.width = `${percentage * 100}%`;

      // Update timestamp display
      const timeStamp = document.querySelector(".timeStamp span");
      const currentTime = formatTime(draggedTime);
      const duration = formatTime(currentAudio.duration);
      timeStamp.textContent = `${currentTime} / ${duration}`;

      // Only update audio position when drag ends
      if (!isDragging) {
        currentAudio.currentTime = draggedTime;
      }
    }
  }
}

// Modify displaySongs function to show first song in seekbar
async function displaySongs() {
  const container = document.getElementById("songs-container");
  songsList = await fetchSongsList();
  setupControls();

  // Load first song details into seekbar
  if (songsList.length > 0) {
    initialSongInfo = await fetchSongInfo(songsList[0]);
    if (initialSongInfo) {
      const seekBarSongName = document.querySelector(".seekBar_songName");
      const seekBarArtistName = document.querySelector(".seekBar_artistName");
      seekBarSongName.textContent = initialSongInfo.title;
      seekBarArtistName.textContent = initialSongInfo.artist;
    }
  }

  for (const songName of songsList) {
    const songInfo = await fetchSongInfo(songName);
    if (songInfo) {
      const songlistinfo = document.createElement("div");
      songlistinfo.className = "song_info";
      songlistinfo.innerHTML = `
                    <div class="song_wrapper">
                        <img src="./images/music.svg" alt="">
                        <div>
                            <p>${songInfo.title}</p>
                            <p>- ${songInfo.artist}</p>
                        </div>
                    </div>
                    <div class="play_wrapper">
                        <p>Play Now</p>
                        <img src="./images/play_now.svg" alt="">
                    </div>
            `;
      songlistinfo.addEventListener("click", () => {
        const index = songsList.indexOf(songName);
        playSong(index);
      });
      document.querySelector(".songlist").appendChild(songlistinfo);

      const songCard = document.createElement("div");
      songCard.className = "song-card";
      songCard.innerHTML = `
                <img src="songs/${songInfo.folder}/${songInfo.image}" alt="${songInfo.title} cover" class="cover-image">
                <h3>${songInfo.title}</h3>
                <p class="Artist_info">Artist: ${songInfo.artist}</p>
                <button class="play-button"><img src="./images/play_button.svg" alt="PlayNow"></button>
            `;
      const playButton = songCard.querySelector(".play-button");
      playButton.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = songsList.indexOf(songName);
        playSong(index);
      });

      container.appendChild(songCard);
    }
  }
}

document.addEventListener("DOMContentLoaded", displaySongs);

hamburger = document.querySelector(".hamburger");
hamburger.addEventListener("click", () => {
  document.getElementsByTagName("aside")[0].style.left = "0%";
});

close = document.querySelector(".close");
close.addEventListener("click", () => {
  document.getElementsByTagName("aside")[0].style.left = "-100%";
});

const searchButton = document.querySelector(".search_btn");
const searchInput = document.querySelector(".search_input");
searchButton.addEventListener("click", () => {
  searchButton.style.display = "none";
  searchInput.style.display = "flex";
});

const searchbox = document.querySelector(".searchbox");
const closeSearch = document.querySelector(".closeSearch");
closeSearch.addEventListener("click", (e) => {
  // Prevent event bubbling
  e.stopPropagation();

  // Clear search box value
  searchbox.value = "";

  // Reset display states
  searchButton.style.display = "flex";
  searchInput.style.display = "none";

  // Ensure all songs are visible again
  const songElements = document.querySelectorAll(".song_info");
  songElements.forEach((element) => {
    element.style.display = "flex";
  });

  // Reset grid view songs too
  const gridSongCards = document.querySelectorAll(".song-card");
  gridSongCards.forEach((card) => {
    card.style.display = "flex";
  });
});

searchbox.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const songElements = document.querySelectorAll(".song_info");

  songElements.forEach((songElement) => {
    const title = songElement
      .querySelector(".song_wrapper p")
      .textContent.toLowerCase();
    const artist = songElement
      .querySelector(".song_wrapper p:last-child")
      .textContent.toLowerCase();

    if (title.includes(searchTerm) || artist.includes(searchTerm)) {
      songElement.style.display = "flex";
    } else {
      songElement.style.display = "none";
    }
    if (searchTerm === "") {
      songElement.style.display = "flex";
    }
  });
  const gridSongCards = document.querySelectorAll(".song-card");
  gridSongCards.forEach((songCard) => {
    const title = songCard.querySelector("h3").textContent.toLowerCase();
    const artist = songCard
      .querySelector(".Artist_info")
      .textContent.toLowerCase();

    if (title.includes(searchTerm) || artist.includes(searchTerm)) {
      songCard.style.display = "Flex";
    } else {
      songCard.style.display = "none";
    }
    if (searchTerm === "") {
      songCard.style.display = "flex";
    }
  });
});
