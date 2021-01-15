export type TwitchCredentials = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export type StreamerInfo = {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
};

export type IEventSubscription = {
  id: string;
  status: string;
  type: string;
  version: string;
  condition?: {};
  created_at: string;
  transport?: {};
};

export type SubsResponse = {
  total: number;
  data: Array<IEventSubscription>;
  limit: number;
  pagination?: {};
};

export type SubscriptionResponse = {
  id: string;
  status: string;
  type: string;
  version: string;
  conditon: {
    broadcaster_user_id: string;
  };
  created_at: string;
  transport: {
    method: string;
    callback: string;
  };
};
