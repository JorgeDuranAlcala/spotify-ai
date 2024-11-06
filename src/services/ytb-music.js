import axios from "axios";
import { BACKEND_URI } from "../config";


export async function ytbMusic(q) {

    const searchResults = await axios.get(`${BACKEND_URI}/music/${q}`);

    return searchResults.data.results;
}
