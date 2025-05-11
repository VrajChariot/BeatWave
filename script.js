async function fetchSongsList() {
    try {
        const response = await fetch('https://api.github.com/repos/vrajchariot/BeatWave/contents/songs');
        const data = await response.json();
        console.log(data);
        // this will filter the data to get only the directories (songs) and map them to their names
        let filter_songs = data.filter(item => item.type === 'dir').map(dir => dir.name);
        console.log(filter_songs);
        return filter_songs;
    } catch (error) {
        console.error('Error fetching songs list:', error);
        return [];
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

let currentAudio = null;

async function displaySongs() {
    const container = document.getElementById('songs-container');
    const songsList = await fetchSongsList();

    for (const songName of songsList) {
        const songInfo = await fetchSongInfo(songName);
        if (songInfo) {
            const songlistinfo = document.createElement('div');
            songlistinfo.className = 'song_info';
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
            songlistinfo.addEventListener('click', () => {
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio = null;
                }

                const audio = new Audio(`songs/${songInfo.folder}/${songInfo.audio}`);
                audio.play();
                currentAudio = audio;
                console.log(`Playing ${songInfo.title} by ${songInfo.artist}`);
            });
            document.querySelector('.songlist').appendChild(songlistinfo);
            const songCard = document.createElement('div');
            songCard.className = 'song-card';
            songCard.innerHTML = `
                <img src="songs/${songInfo.folder}/${songInfo.image}" alt="${songInfo.title} cover" class="cover-image">
                <h3>${songInfo.title}</h3>
                <p class="Artist_info">Artist: ${songInfo.artist}</p>
                <button class="play-button"><img src="./images/play_button.svg" alt="PlayNow"></button>
            `;
            const playButton = songCard.querySelector('.play-button');
            playButton.addEventListener('click', () => {
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio = null;
                }

                const audio = new Audio(`songs/${songInfo.folder}/${songInfo.audio}`);
                audio.play();
                currentAudio = audio;
                console.log(`Playing ${songInfo.title} by ${songInfo.artist}`);
            });

            container.appendChild(songCard);
        }
    }
}

document.addEventListener('DOMContentLoaded', displaySongs);