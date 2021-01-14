import { OAuthService } from '../../@types/global';
import axios, { AxiosInstance } from 'axios';
import Querystring from 'querystring';
import { TwitchCredentials } from '../../@types/twitch';

export class IdService implements OAuthService {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({ baseURL: 'https://id.twitch.tv' });
  }

  async refreshToken(): Promise<OAuthService.Response> {
    const {
      TWITCH_CLIENT_ID: client_id,
      TWITCH_SECRET: client_secret,
    } = process.env;

    const params = Querystring.encode({
      client_id,
      client_secret,
      grant_type: 'client_credentials',
    });

    const { data } = await this.httpClient.post<TwitchCredentials>(
      `oauth2/token?${params}`
    );

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
      platform: 'twitch',
    };
  }
}
