import axios from 'axios';

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large: string;
    large2x: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
}

export interface PexelsSearchResponse {
  page: number;
  per_page: number;
  total_results: number;
  next_page: string;
  photos: PexelsPhoto[];
}

export class PexelsService {
  private static apiKey = process.env.PEXELS_API_KEY || '';
  private static apiBaseUrl = 'https://api.pexels.com/v1';

  /**
   * Search for photos
   */
  static async searchPhotos(
    query: string,
    page: number = 1,
    perPage: number = 15
  ): Promise<PexelsSearchResponse> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/search`, {
        headers: {
          Authorization: this.apiKey,
        },
        params: {
          query,
          page,
          per_page: perPage,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to search photos: ${error.message}`);
    }
  }

  /**
   * Get curated photos
   */
  static async getCuratedPhotos(page: number = 1, perPage: number = 15): Promise<PexelsSearchResponse> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/curated`, {
        headers: {
          Authorization: this.apiKey,
        },
        params: {
          page,
          per_page: perPage,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get curated photos: ${error.message}`);
    }
  }

  /**
   * Get a specific photo by ID
   */
  static async getPhoto(id: number): Promise<PexelsPhoto> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/photos/${id}`, {
        headers: {
          Authorization: this.apiKey,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get photo: ${error.message}`);
    }
  }

  /**
   * Get trending collection
   */
  static async getTrendingPhotos(page: number = 1, perPage: number = 15): Promise<PexelsSearchResponse> {
    // Using search with empty query as alternative to trending endpoint
    try {
      const response = await axios.get(`${this.apiBaseUrl}/curated`, {
        headers: {
          Authorization: this.apiKey,
        },
        params: {
          page,
          per_page: perPage,
          order: 'popular',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get trending photos: ${error.message}`);
    }
  }

  /**
   * Get random photo
   */
  static async getRandomPhoto(): Promise<PexelsPhoto> {
    try {
      const response = await this.getCuratedPhotos(1, 1);
      const photos = response.photos;
      if (photos.length === 0) {
        throw new Error('No photos available');
      }
      return photos[0];
    } catch (error: any) {
      throw new Error(`Failed to get random photo: ${error.message}`);
    }
  }
}
