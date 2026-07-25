import axios from "axios";
import type { MoviesHttpResponse } from "../types/movie.ts";

interface FetchMoviesParams {
  query: string;
  include_adult: boolean;
  language: string;
  page: number;
}

const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export default async function fetchMovies(
  query: string,
  page: number,
): Promise<MoviesHttpResponse> {
  const params: FetchMoviesParams = {
    query,
    include_adult: false,
    language: "en-US",
    page,
  };

  const response = await axios.get<MoviesHttpResponse>(BASE_URL, {
    params,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.data;
}
