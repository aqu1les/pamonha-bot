import { Schema, model, Document } from 'mongoose';

const MySubscriptionsSchema = new Schema<MySubscriptions>({
  enabled: {
    type: Boolean,
    default: false,
  },
  platform: String,
  streamerId: String,
  type: String,
  tokenType: String,
  platformSubscriptionId: String,
});

export interface MySubscriptions extends Document {
  enabled: boolean;
  platform: string;
  streamerId: string;
  type: string;
  tokenType: string;
  platformSubscriptionId: string;
}

export default model('my_subscriptions', MySubscriptionsSchema);
