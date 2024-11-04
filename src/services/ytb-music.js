import axios from "axios";


export async function ytbMusic(q) {

    const searchResults = await axios.get(`https://api-spotify-ai.onrender.com/music/${q}`);

    return searchResults.data.results;
}
