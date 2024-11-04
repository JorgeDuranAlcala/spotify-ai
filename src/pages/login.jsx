// src/components/Login.jsx
import React, { useState } from 'react';
import { CLIENT_ID, DOMAIN_URI } from '../config';

function Login() {
  const [clientId, setClientId] = useState(CLIENT_ID);
  const [redirectUri, setRedirectUri] = useState(`${DOMAIN_URI}/callback`);

  const handleLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=user-read-private%20user-read-email%20user-top-read%20playlist-read-private%20playlist-modify-public%20playlist-modify-private%20user-follow-read%20user-library-read%20streaming`;
    window.location.href = authUrl;
  };

  return (
    <div className='flex flex-col gap-2 p-4 w-full h-screen justify-center items-center'>
      <button 
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 flex items-center"
        onClick={handleLogin}
      >
        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM13.698 14.284C13.5704 14.5101 13.3034 14.5851 13.0773 14.4574C11.0871 13.2934 8.63293 13.0507 5.66846 13.7309C5.40667 13.7968 5.14431 13.6299 5.07829 13.3681C5.01226 13.1063 5.17923 12.8439 5.44102 12.7779C8.67307 12.0372 11.4115 12.3202 13.6453 13.6227C13.8714 13.7504 13.9257 14.0579 13.698 14.284ZM14.7049 11.8517C14.5393 12.1311 14.2088 12.2244 13.9294 12.0589C11.6591 10.7429 8.29633 10.3859 5.44102 11.1967C5.12772 11.2867 4.80006 11.0942 4.71012 10.7809C4.62017 10.4676 4.81263 10.1399 5.12594 10.05C8.35753 9.13612 12.0873 9.53641 14.6977 11.0762C14.9771 11.2418 15.0704 11.5723 14.7049 11.8517ZM14.8039 9.3349C12.0873 7.81636 7.39068 7.62708 5.01226 8.49796C4.63735 8.6072 4.24315 8.37741 4.13392 8.0025C4.02468 7.62758 4.25447 7.23338 4.62938 7.12415C7.39068 6.13488 12.5519 6.35487 15.6712 8.12305C16.0047 8.32374 16.1139 8.75625 15.9132 9.08977C15.7125 9.42328 15.28 9.53252 14.9465 9.33183L14.8039 9.3349Z"/>
        </svg>
        Iniciar sesión con Spotify
      </button>
    </div>
  );
}

export default Login;