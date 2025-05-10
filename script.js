async function fetchSongsList() {
    try {
        const response = await fetch('https://api.github.com/repos/vrajchariot/BeatWave/contents/songs');
        const data = await response.json();
        return data.filter(item => item.type === 'dir').map(dir => dir.name);
    } catch (error) {
        console.error('Error fetching songs list:', error);
        return [];
    }
}

async function fetchSongInfo(songName) {
    try {
        const response = await fetch(`songs/${songName}/info.json`);
        const data = await response.json();
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
            const songCard = document.createElement('div');
            songCard.className = 'song-card';
            songCard.innerHTML = `
                <h3>${songInfo.title}</h3>
                <p>Artist: ${songInfo.artist}</p>
                <p>${songInfo.description || ''}</p>
                <button class="play-button">Play</button>
            `;
            
            songCard.addEventListener('click', () => {
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio = null;
                }
                
                const audio = new Audio(`songs/${songInfo.folder}/${songInfo.audio}`);
                audio.play();
                currentAudio = audio;
            });
            
            container.appendChild(songCard);
        }
    }
}

document.addEventListener('DOMContentLoaded', displaySongs);