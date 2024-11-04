import { useState } from "react";
import { ytbMusic } from "../services/ytb-music";

export default function useYtbMusic() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchYtbMusic = async (query) => {
    try {
      setLoading(true);
      const results = await ytbMusic(query);
      setLoading(false);
      return results
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return { loading, error, searchYtbMusic };
}