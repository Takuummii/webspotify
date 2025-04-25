import React, {useState, useEffect} from 'react';
import playIcon from './icons/Play.png';
import pauseIcon from './icons/Pause.png';
import nextIcon from './icons/Next.png';
import backIcon from './icons/Previous.png';

const track = {
    name: "",
    album: {
        images: [{url: ""}]
    },
    artists: [{name: ""}]
}

function WebPlayback(props) {
    const [player,setPlayer] = useState(undefined);
    const [is_active,setActive] = useState(false);
    const [is_paused,setPaused] = useState(false);
    const [current_track,setTrack] = useState(false);
    const [volume, setVolume] = useState(50);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js"
        script.async = true;
        document.body.appendChild(script);
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.3
            });
    
            setPlayer(player);
            player.addListener('ready', ({device_id}) => {
                console.log('Ready with Device ID', device_id);
            });
    
            player.addListener('not_ready', ({device_id}) => {
                console.log('Device ID has gone offline', device_id);
            });
            player.addListener('player_state_changed', ( state => {
                if (!state) {
                    return;
                }
                setTrack(state.track_window.current_track);
                setPaused(state.paused);
                player.getCurrentState().then(state => {
                    (!state) ? setActive(false) : setActive(true)
                });
            }));
            player.connect();
            };
    
            
    },[]);

    const handleVolumeChange = (e) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);
        if (player) {
          player.setVolume(newVolume / 100).catch(err => console.error("Failed to set volume", err));
        }
      };

    if (!is_active) {return (
        <>
            <div className="container">
                <div className="main-wrapper">
                    <b> Instance not active. Transfer your playback using your Spotify app </b>
                </div>
            </div>
        </>)
} else {
    return (
        <>
            <div className="container">
                <div className="main-wrapper">

                    <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                    <div className="now-playing__side">
                        <div className="now-playing__name">{current_track.name}</div>
                        <div className="now-playing__artist">{current_track.artists[0].name}</div>
                        <div className="bg"></div>
                        <button className="btn-spotify" id="back" onClick={() => { player.previousTrack() }} >
                            <img src={backIcon} alt="BACK"></img>
                        </button>

                        <button className="btn-spotify" id="playb" onClick={() => { player.togglePlay() }} >
                            <img src={ is_paused ? playIcon : pauseIcon } alt={is_paused ? "PLAY" : "PAUSE"}></img>
                        </button>

                        <button className="btn-spotify" id="next" onClick={() => { player.nextTrack() }} >
                            <img src={nextIcon} alt="NEXT"></img>
                        </button>
                        <div className="slidecontainer">
                            <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} className="slider" id="volume-slider"></input>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
}
    
export default WebPlayback