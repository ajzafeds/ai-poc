import axios from 'axios';

const BASE_URL = 'https://anime-db.p.rapidapi.com/anime';

export interface AnimeApiParams {
  page?: string;
  size?: string;
  search?: string;
  genres?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Anime {
  __v?: number;
  alternativeTitles: string[];
  genres: string[];
  hasRanking: boolean;
  image: string;
  link: string;
  ranking: number;
  thumb: string;
  title: string;
  episodes: number;
  hasEpisode: boolean;
  status: string;
  synopsis?: string;
  type: string;
  updatedAt: string;
  workerId: string;
  score: number;
  id: string;
  _id: string;
}

export interface AnimeApiMeta {
  page: number;
  size: number;
  totalData: number;
  totalPage: number;
}

export interface AnimeApiResponse {
  data: Anime[];
  meta: AnimeApiMeta;
}

export const fetchAnime = async (params: AnimeApiParams = {}): Promise<AnimeApiResponse> => {
  const defaultParams = {
    page: '1',
    size: '10',
    search: 'Fullmetal',
    genres: 'Fantasy,Drama',
    sortBy: 'ranking',
    sortOrder: 'asc' as const,
  };

  const requestParams = { ...defaultParams, ...params };

  try {
    const response = await axios.get<AnimeApiResponse>(BASE_URL, {
      params: requestParams,
      headers: {
        'x-rapidapi-key': 'b5d2e56f88msh8e71e045d48599dp1548cbjsn41dfd1e4ecf6',
        'x-rapidapi-host': 'anime-db.p.rapidapi.com',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Anime API error: ${error.message}`);
    }
    throw error;
  }
};

