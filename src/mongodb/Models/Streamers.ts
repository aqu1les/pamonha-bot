import { Schema, model, Document } from 'mongoose';

const StreamerSchema = new Schema<StreamerDocument>({
  streamerId: String,
  login: String,
  displayName: String,
});

export interface StreamerDocument extends Document {
  streamerId: string;
  login: string;
  displayName: string;
}

export interface Streamer {
  streamerId: string;
  login: string;
  displayName: string;
}

export default model('streamers', StreamerSchema);
