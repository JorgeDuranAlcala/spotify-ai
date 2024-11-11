import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const qString = window.location.search;
    const urlSearch = new URLSearchParams(qString);
    const accessToken = urlSearch.get("access_token");
    const refresh_token = urlSearch.get("refresh_token");
    
    const getToken = async () => {
      try {
        if (accessToken) {
          window.localStorage.setItem("accessToken", accessToken);
          window.localStorage.setItem("refreshToken", refresh_token);
          navigate("/main")
        }
      } catch (error) {
        console.error('Error al obtener el token de acceso:', error);
      }
    };

    getToken();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center">
      {/* Animated Logo */}
      <div className="mb-8">
        <div className="w-16 h-16 relative animate-pulse">
          <svg className="w-full h-full text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM13.698 14.284C13.5704 14.5101 13.3034 14.5851 13.0773 14.4574C11.0871 13.2934 8.63293 13.0507 5.66846 13.7309C5.40667 13.7968 5.14431 13.6299 5.07829 13.3681C5.01226 13.1063 5.17923 12.8439 5.44102 12.7779C8.67307 12.0372 11.4115 12.3202 13.6453 13.6227C13.8714 13.7504 13.9257 14.0579 13.698 14.284Z"/>
          </svg>
        </div>
      </div>

      {/* Loading Text */}
      <h2 className="text-white text-2xl font-bold mb-4">Connecting to Spotify</h2>
      
      {/* Loading Animation */}
      <div className="flex gap-2">
        <div className="w-2 h-8 bg-green-500 animate-[bounce_1s_ease-in-out_infinite]"></div>
        <div className="w-2 h-8 bg-green-500 animate-[bounce_1s_ease-in-out_0.2s_infinite]"></div>
        <div className="w-2 h-8 bg-green-500 animate-[bounce_1s_ease-in-out_0.4s_infinite]"></div>
      </div>

      {/* Loading Message */}
      <p className="text-gray-400 mt-6 text-center max-w-md">
        Getting ready to create your AI-powered playlists...
      </p>
    </div>
  );
}

export default Callback;
