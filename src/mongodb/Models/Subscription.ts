import { Schema, model, Document } from 'mongoose';

const SubscriptionSchema = new Schema<SubscriptionDocument>({
  chatId: String,
  platform: String,
  streamerId: String,
});

export interface SubscriptionDocument extends Document {
  chatId: string;
  platform: string;
  streamerId: string;
}

export interface Subscription {
  chatId: string;
  platform: string;
  streamerId: string;
}

export default model('subscriptions', SubscriptionSchema);
