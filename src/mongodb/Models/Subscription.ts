import { Schema, model, Document } from 'mongoose';

const SubscriptionSchema = new Schema<Subscription>({
  chatId: String,
  platform: String,
  streamerId: String,
});

export interface Subscription extends Document {
  chatId: string;
  platform: string;
  streamerId: string;
}

export default model('subscriptions', SubscriptionSchema);
