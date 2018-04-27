// Documentation on the Giphy SDK client can be
// found here: https://github.com/Giphy/giphy-js-sdk-core
import * as GiphyJSClient from 'giphy-js-sdk-core';

import { Rating, ResultSort, IGifObject } from '../types';

export interface ISearchParams {
  q: string;
  rating: Rating;
  sort: ResultSort;
  limit: number;
  offset: number;
}

export interface ISearchResult {
  gifObjects: IGifObject[];
}

export interface ITrendingParams {
  rating: Rating;
  limit: number;
}

export class GiphyClient {
  private client: any;

  constructor(apiKey: string) {
    // create a new Giphy JS SDK client
    this.client = GiphyJSClient(apiKey);
  }

  /**
   * Execute a search for gifs based on a search string
   * @param params ISearchParams
   */
  public searchGifs(params: ISearchParams): Promise<ISearchResult> {
    return this.client.search('gifs', params).then(response => {
      return { gifObjects: response.data };
    });
  }

  public trendingGifs(params: ITrendingParams): Promise<ISearchResult> {
    return this.client.trending('gifs', params).then(response => {
      return { gifObjects: response.data };
    });
  }
}
