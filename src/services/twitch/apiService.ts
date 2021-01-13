import axios, { AxiosInstance, AxiosResponse } from 'axios';

class ApiService {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({ baseURL: 'https://api.twitch.tv' });
  }

  listSubscriptions(): Promise<AxiosResponse<SubsResponse>> {
    return this.httpClient.get('helix/eventsub/subscriptions');
  }
}

export default new ApiService();

type IEventSubscription = {
  id: string;
  status: string;
  type: string;
  version: string;
  condition?: {};
  created_at: string;
  transport?: {};
};

type SubsResponse = {
  total: number;
  data: Array<IEventSubscription>;
  limit: number;
  pagination?: {};
};
