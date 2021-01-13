import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Querystring from 'querystring';

export class IdService {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({ baseURL: 'https://id.twitch.tv' });
  }

  refreshToken(): Promise<AxiosResponse<TwitchCredentials>> {
    const {
      TWITCH_CLIENT_ID: client_id,
      TWITCH_SECRET: client_secret,
    } = process.env;

    const params = Querystring.encode({
      client_id,
      client_secret,
      grant_type: 'client_credentials',
    });

    return this.httpClient.post(`oauth2/token?${params}`);
  }
}

type TwitchCredentials = {
  access_token: string;
  expires_in: number;
  token_type: string;
};
