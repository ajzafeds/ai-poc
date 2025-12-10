import axios from 'axios';

// Jikan v4 base URL (see `/anime` in the docs: https://docs.api.jikan.moe/)
const BASE_URL = 'https://api.jikan.moe/v4';

export interface AnimeImagesFormat {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface AnimeImages {
  jpg: AnimeImagesFormat;
  webp: AnimeImagesFormat;
}

export interface AnimeTitle {
  type: string;
  title: string;
}

export interface AnimeDateProp {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface AnimeAiredProp {
  from: AnimeDateProp;
  to: AnimeDateProp;
  string: string;
}

export interface AnimeAired {
  from: string | null;
  to: string | null;
  prop: AnimeAiredProp;
}

export interface AnimeTrailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
}

export interface AnimeEntityRef {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Anime {
  mal_id: number;
  url: string;
  images: AnimeImages;
  trailer: AnimeTrailer;
  approved: boolean;
  titles: AnimeTitle[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string | null;
  source: string | null;
  episodes: number | null;
  status: string | null;
  airing: boolean;
  aired: AnimeAired;
  duration: string;
  rating: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  broadcast: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
  producers: AnimeEntityRef[];
  licensors: AnimeEntityRef[];
  studios: AnimeEntityRef[];
  genres: AnimeEntityRef[];
  explicit_genres: AnimeEntityRef[];
  themes: AnimeEntityRef[];
  demographics: AnimeEntityRef[];
}

export interface AnimeApiPaginationItems {
  count: number;
  total: number;
  per_page: number;
}

export interface AnimeApiPagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: AnimeApiPaginationItems;
}

export interface AnimeApiResponse {
  data: Anime[];
  pagination: AnimeApiPagination;
}

export interface AnimeApiParams {
  page?: number;
  limit?: number;
  sfw?: boolean;
}

export const fetchAnime = async (params: AnimeApiParams = {}): Promise<AnimeApiResponse> => {
  const defaultParams: Required<Pick<AnimeApiParams, 'page' | 'limit' | 'sfw'>> = {
    page: 1,
    limit: 24,
    sfw: true,
  };

  const requestParams = { ...defaultParams, ...params };

  try {
    const response = await axios.get<AnimeApiResponse>(`${BASE_URL}/anime`, {
      params: requestParams,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Anime API error: ${error.message}`);
    }
    throw error;
  }
};

