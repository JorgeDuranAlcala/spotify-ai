// src/components/Callback.jsx
import React, { useEffect } from 'react';
import axios from 'axios';
import { CLIENT_ID, CLIENT_SECRET, DOMAIN_URI } from '../config';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const qString = window.location.search;
    const urlSearch = new URLSearchParams(qString);
    const code = urlSearch.get("code");
    const accessToken = urlSearch.get("access_token");
    const refresh_token = urlSearch.get("refresh_token");
    console.log({
      code,
      accessToken,
      refresh_token,
    })
    const getToken = async () => {
      try {
        if (accessToken) {
          window.localStorage.setItem("accessToken", accessToken);
          window.localStorage.setItem("refreshToken", refresh_token);
          navigate("/main")
        }
/*         const authParams = {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization:
                "Basic " +
                "ZWFjZWQ2MTY5NGI5NGUzZDhhNDFhNGRhNGM1MGEwZmY6YTY4NTBhMTRmY2MxNGE5Mjk0N2RhOTI4MzJkMDRmYjg="
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                redirect_uri: `http://localhost:5173/callback`,
                code: code,
                client_id:  CLIENT_ID,
                client_secret: CLIENT_SECRET,
            }),
        }
        fetch("https://accounts.spotify.com/api/token", authParams)
        // set result as json
          .then((result) => result.json())
          // log data and set tokens using state variables
          .then(async (data) => {
            console.log(data);
            const accessToken = data.access_token;
            if (accessToken) {
                window.localStorage.setItem("accessToken", accessToken);
                window.localStorage.setItem("refreshToken", data.refresh_token);
                window.location.href = `${DOMAIN_URI}/main`;
            }
        }) */
/*        axios.get('http://localhost:3000/callback?code=' + code)
       .then(response => {
          console.log(response.data);
          //window.location.href = `${DOMAIN_URI}/main`;
        })
        .catch(error => {
          console.error('Error al obtener el token de acceso:', error);
        }); */
        // Utiliza el token de acceso para realizar solicitudes autenticadas a la API de Spotify
      } catch (error) {
        console.error('Error al obtener el token de acceso:', error);
      }
    };

    getToken();
  }, []);

  return null;
}

export default Callback;