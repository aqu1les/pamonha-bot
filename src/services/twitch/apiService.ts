import { StreamerInfo, SubsResponse } from '../../@types/twitch';
import axios, { AxiosInstance } from 'axios';
import Querystring from 'querystring';
import { StreamerNotFound } from '../../exceptions/twitch';

export default class ApiService {
  private httpClient: AxiosInstance;

  constructor() {
    const { TWITCH_CLIENT_ID: client_id } = process.env;

    this.httpClient = axios.create({
      baseURL: 'https://api.twitch.tv',
      headers: {
        'client-id': client_id,
      },
    });

    this.httpClient.interceptors.request.use((request) => {
      request.headers.Authorization = `Bearer ${process.env.TWITCH_TOKEN}`;
      return request;
    });
  }

  listSubscriptions(): Promise<SubsResponse> {
    return this.httpClient.get('helix/eventsub/subscriptions');
  }

  getStreamer(nickName: string): Promise<StreamerInfo> {
    return new Promise(async (resolve, reject) => {
      const params = Querystring.encode({
        login: nickName,
      });

      const { data } = await this.httpClient.get(`helix/users?${params}`);

      if (data.data instanceof Array && data.data.length === 0) {
        const error = new StreamerNotFound();
        return reject(error);
      }

      return resolve({ ...data.data[0] });
    });
  }

  subscribeWebhook(streamerId: string) {
    const { APP_URL: app_url, SECRET_WEBHOOK: secret } = process.env;

    return this.httpClient.post('helix/eventsub/subscriptions', {
      type: 'stream.online',
      version: '1',
      condition: {
        broadcaster_user_id: streamerId,
      },
      transport: {
        method: 'webhook',
        callback: app_url,
        secret: secret,
      },
    });
  }
}

// https://api.twitch.tv/helix/eventsub/subscriptions

/**
 * 
 * {
    "type": "stream.online",
    "version": "1",
    "condition": {
        "broadcaster_user_id": "635647858"
    },
    "transport": {
        "method": "webhook",
        "callback": "{{ _.ngrok_url }}/webhook",
        "secret": ""
    }
}
 */
