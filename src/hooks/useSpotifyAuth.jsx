import { useState, useEffect } from 'react';
import { BACKEND_URI, CLIENT_ID } from '../config';
import axios from 'axios';

const useSpotifyAuth = () => {
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  const getRefreshToken = async () => {

    // refresh token that has been previously stored
    const refreshToken = localStorage.getItem('refreshToken');
    axios.get(`${BACKEND_URI}/${refreshToken}/refresh`)
      .then((response) => {
        console.log('obtenido', response.data)
        const res = {
          accessToken: response.data.accessToken.access_token,
        };
        setAccessToken(res.accessToken);
        localStorage.setItem('accessToken', res.accessToken);
      })
      .catch((error) => {
        console.error('Error al obtener el token de acceso:', error);
      }); 
   }

  return { accessToken, getRefreshToken };
};

export default useSpotifyAuth;