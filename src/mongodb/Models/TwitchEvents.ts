import { Schema, model, Document } from 'mongoose';

const TwitchEventsLogs = new Schema<TwitchEventsLogsDocument>({
  type: String,
  isRetry: Boolean,
  messageId: String,
  emittedAt: String,
});

interface TwitchEventsLogsDocument extends Document {
  type: string;
  isRetry: boolean;
  messageId: string;
  emittedAt: string;
}

export interface TwitchEventsLogs {
  type: string;
  isRetry: boolean;
  messageId: string;
  emittedAt: string;
}

export default model('twitch_events_logs', TwitchEventsLogs);
