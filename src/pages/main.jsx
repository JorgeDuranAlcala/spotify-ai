import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Box from "../components/Box";
import useSpotifyAuth from "../hooks/useSpotifyAuth";
import { toast } from "react-toastify";
import useYtbMusic from "../hooks/useYtbMusic";
import YouTube from 'react-youtube';
import Slider from '@mui/material/Slider';
import { Spinner } from "../components/Spiner";
import { DOMAIN_URI } from '../config'

const opts = {
  height: '1',
  width: '1',
  playerVars: {
    autoplay: 1,
  },
};

const moodExamples = [
  {
    mood: "Kurt cobain is the goat 🐐",
    genres: "Rock, Indie, Alternative, Grunge",
  },
  {
    mood: "A road trip with the windows down, feeling the wind in your hair and the sun on your face.",
    genres: "Country, Rock, Folk",
  },
  {
    mood: "Lost in a crowd of people, feeling the energy and excitement of a big city.",
    genres: "Pop, Dance, Electronic",
  },
  {
    mood: "Sitting on a beach, feeling the warmth of the sun and the sound of the waves crashing on the shore.",
    genres: "Reggae, Ska, Dub",
  },
  {
    mood: "Sitting in a coffee shop, feeling the warmth of the sun and the sound of the waves crashing on the shore.",
    genres: "Rock, Indie, Alternative",
  },
  {
    mood: "Running through a park, feeling the rush of endorphins and the beauty of nature.",
    genres: "Hip Hop, Rap, R&B",
  },
  {
    mood: "Feeling of nostalgia, feeling the warmth of the sun and the sound of the waves crashing on the shore.",
    genres: "Classical, Jazz, Blues",
  },
];

const getThreeRandomMoods = () => {
  const randomMoods = [];
  const moodExamplesCopy = [...moodExamples];
  while (randomMoods.length < 3) {
    const randomIndex = Math.floor(Math.random() * moodExamplesCopy.length);
    const randomMood = moodExamplesCopy[randomIndex];
    randomMoods.push(randomMood);
    moodExamplesCopy.splice(randomIndex, 1);
  }
  return randomMoods;
};

function Main() {
  const [mood, setMood] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [songTypes, setSongTypes] = useState([]);
  const { accessToken, getRefreshToken } = useSpotifyAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [examples, setExamples] = useState(getThreeRandomMoods());
  const [progress, setProgress] = useState(0);
  const { searchYtbMusic, loading } = useYtbMusic();
  const [videoId, setVideoId] = useState(null);
  const [activeTab, setActiveTab] = useState('mood'); // Add this near other state declarations
  const [artist, setArtist] = useState(''); // Add this near other state declarations
  console.log('d', DOMAIN_URI)
  
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const onReady = (event) => {
    playerRef.current = event.target;
    playerRef.current?.playVideo();
    setIsVideoReady(true);
  };
  
  // Add these control functions
  const playVideo = () => {
    playerRef.current?.playVideo();
  };
  
  const pauseVideo = () => {
    playerRef.current?.pauseVideo();
  };
  
  const stopVideo = () => {
    playerRef.current?.stopVideo();
  };

  const handleSliderChange = (event, newValue) => {
    setProgress(newValue);
    if (playerRef.current) {
        const duration = playerRef.current.getDuration();
        const newTime = (newValue / 100) * duration;
        playerRef.current.seekTo(newTime, true); // Seek to the new time
    }
};

useEffect(() => {
  // If videoId changes, reset progress
  if (videoId) {
      setProgress(0);
      setIsVideoReady(false); // Reset video readiness
  } else {
      setIsVideoReady(false); // Hide video if videoId is null
  }
}, [videoId]); 

useEffect(() => {
  const updateProgress = () => {
      if (playerRef.current) {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          if (duration) {
              setProgress((currentTime / duration) * 100);
          }
      }
  };


  // Set the interval for updating progress
  intervalRef.current = setInterval(updateProgress, 1000);

  // Cleanup function to clear the interval
  return () => {
      clearInterval(intervalRef.current);
  };
}, [isVideoReady]);

  const handleGenerateClick = async () => {
    console.log({
      mood,
      artist,
      activeTab
    })
    try {
      setPlaylistTracks([]);
      setIsLoading(true);
      const response = await axios.post(
        `https://api-spotify-ai.onrender.com/generate-playlist`,
        { 
          mood: activeTab === 'mood' ? mood : undefined,
          artist: activeTab === 'artist' ? artist : undefined,
          accessToken
        }
      );
      setPlaylistTracks(response.data.playlist);
      setSongTypes(response.data.songTypes);
      setMood("");
      toast.success("Playlist generated successfully");
    } catch (error) {
      console.error(
        "Error al generar la playlist:",
        error.message.includes("Invalid")
      );
      if (error.message) {
        //await getRefreshToken();
        //handleGenerateClick();
      }
      console.error("Error al generar la playlist:", error.message);
      toast.error("Error al generar la playlist, intentelo nuevamente por favor.");
    } finally {
      setIsLoading(false);
    }
};

  const handleSavePlaylist = async () => {
    try {
      const trackUris = playlistTracks.map((track) => track.uri);
      const { data } = await axios.post(`https://api-spotify-ai.onrender.com/playlist/save`, {
        songTypes,
        accessToken,
        trackUris,
      });
      if (data.success) {
        toast.success("Playlist saved successfully");
        setPlaylistTracks([]);
        setSongTypes([]);
        setMood("");
      }
    } catch (error) {
      console.error("Error al generar la playlist:", error);
      toast.error("Error al generar la playlist: ");
    }
  };

  const handlePlayTrack = async (track) => {
    const query = `${track.name} ${track.artists[0].name}`;
    const videos = await searchYtbMusic(query);
    setVideoId(videos[0].videoId);
  };

  const handleSelectExample = (mood) => {
    setMood(mood);
  };

  const handleGetExamplesAgain = () => {
    setMood("");
    setExamples(getThreeRandomMoods());
  };

  const handleMoodChange = (e) => {
    if (e.target.value.length > 130 || mood.length >= 130) {
      return;
    }
    setMood(e.target.value);
  };

  const handleArtistChange = (e) => {
    if (e.target.value.length > 130 || artist.length >= 130) {
      return;
    }
    setArtist(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2 p-4 w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animate-gradient-xy">
      
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="inline-flex rounded-lg bg-black/30 p-1">
          <button
            onClick={() => setActiveTab('mood')}
            className={`${
              activeTab === 'mood'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            } px-4 py-2 rounded-lg font-medium transition-colors duration-200`}
          >
            By Mood
          </button>
          <button
            onClick={() => setActiveTab('artist')}
            className={`${
              activeTab === 'artist'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            } px-4 py-2 rounded-lg font-medium transition-colors duration-200`}
          >
            By Artist
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="flex w-2/4 gap-2">
          <div className="flex items-center gap-2 bg-black/80 backdrop-filter w-full p-2 rounded-lg border-b-2 border-blue-500 focus-within:border-blue-400 transition-all duration-300">
{       activeTab === 'mood' ? (<input
              onChange={handleMoodChange}
              value={mood}
              className="flex w-full p-2 rounded-lg bg-transparent focus:outline-none text-white"
              type="text"
              placeholder="Type in your mood..."
            />) : (
              <input
                onChange={handleArtistChange}
                value={artist}
                className="flex w-full p-2 rounded-lg bg-transparent focus:outline-none text-white"
                type="text"
                placeholder="Type in your artist name... 😎"
              />
            )
  }
          </div>
          <button
            className={`bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 ${
              isLoading && "bg-gray-400"
            }`}
            onClick={handleGenerateClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner/>
            ) : (
              "Generate🎧"
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-center items-center">
      <div style={{
        width: '100%',
        backgroundColor: 'black',
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: 1000,
        display: loading ? 'none' : 'flex',
        gap: 10,
      }}  className="p-4">
        <div style={{ flex: 0.2, display: 'flex', gap: 10 }}>
          <img src={currentTrack?.album.images[0].url} alt="Track image" style={{
            width: '50px',
            height: '50px',
            objectFit: 'cover',
            display: currentTrack?.album.images[0].url ? 'block' : 'none'
          }} />
          <div className="flex flex-col">
              <span className="font-bold">{currentTrack?.name}</span>
                <p className="text-lg text-gray-300">
                  {currentTrack?.artists[0].name}
                </p>
          </div>
        </div>
        <div style={{ flex: 0.8, display: 'flex', gap: 20 }}>
            <div className="flex w-full gap-2 items-center justify-center">
              {videoId &&  <YouTube 
                videoId={videoId}
                opts={opts} 
                onReady={onReady}
              />}
            <Slider
                value={progress}
                onChange={handleSliderChange}
                aria-labelledby="continuous-slider"
                style={{ marginTop: '10px' }}
            />
            <div className="flex gap-2 mx-4">
                <button 
                  className="bg-blue-500 text-white p-2 px-3 rounded-full transform hover:scale-110 transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/50"
                  onClick={playVideo}
                >
                  ▶ 
                </button>
                <button 
                  className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-700 transform hover:scale-110 transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/50"
                  onClick={pauseVideo}
                >
                  ⏸
                </button>
                <button 
                  className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-700 transform hover:scale-110 transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/50"
                  onClick={stopVideo}
                >
                  ⏹
                </button>
            </div>
          </div>
        </div>
      </div>

        {playlistTracks.length > 0 && (
          <button
            className={`flex w-2/4 bg-red-500 text-white p-2 rounded-lg justify-center mt-2 hover:bg-red-700 hover:transform hover:scale-105 transition-transform duration-300`}
            onClick={() => {
              setPlaylistTracks([]);
              setSongTypes([]);
              setMood("");
              toast.success("Playlist cleared");
            }}
          >
            Cancel
          </button>
        )}
        {playlistTracks.length > 0 && (
          <button
            className={`flex w-2/4 bg-green-500 text-white p-2 rounded-lg justify-center mt-2 hover:bg-green-700 hover:transform hover:scale-105 transition-transform duration-300 ${
              isLoading && "bg-gray-200"
            }`}
            onClick={handleSavePlaylist}
          >
            Save playlist 💾
          </button>
        )}
        <div className="flex w-full justify-center my-4 flex-wrap gap-2">
          {playlistTracks.map((track, index) => (
            <div key={track.id} className="flex items-center w-full bg-black/80 p-2 rounded-lg gap-2 transform hover:translate-x-2 transition-all duration-300 hover:shadow-xl">
              <div style={{ display: "flex", flex: 0.1 }} className="gap-2 items-center">
                <span className="font-bold p-2">{index + 1}</span>
                <img
                    style={{ width: 40, height: 40 }}
                    src={track.album.images[0].url}
                    alt={track.name}
                  />
              </div>
              <div style={{ display: "flex items-center gap-2", flex: 0.9 }}>

                <div className="flex flex-col">
                  <span className="font-bold">{track.name}</span>
                  <p className="text-lg text-gray-300">
                    {track.artists[0].name}
                  </p>
                </div>
              </div>
              <div className="flex">
                <button className="m-4 btn text-white rounded-full bg-blue-500 px-2 pt-1 pb-1 hover:bg-blue-700 transform hover:scale-110 transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/50" onClick={() => {
                    setCurrentTrack(track);
                    handlePlayTrack(track);
                }}>
                  {(loading && currentTrack.id === track.id) ? <Spinner/> : '▶'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 80,
          left: 0,
          right: 0,
          display: playlistTracks.length <= 0 ? "flex" : "none",
          justifyContent: "center",
        }}
      >
        <div className="flex flex-col gap-2 justify-center items-center">
          <h2 className="text-2xl">
            Mood Examples{" "}
            <span className="cursor-pointer" onClick={handleGetExamplesAgain}>
              🔃
            </span>
          </h2>
          <div className="flex flex-col gap-2 justify-center items-center">
            <h2>Web player</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <Box
                onClick={() => handleSelectExample(example.mood)}
                key={index}
                className="cursor-pointer w-56 hover:transform hover:scale-105 transition-transform duration-300"
              >
                <span>{example.mood}</span>
                <p className="text-gray-400">{example.genres}</p>
              </Box>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
