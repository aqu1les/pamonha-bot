import mongoose, { Schema } from 'mongoose';

const SettingsSchema = new Schema({
  platform: String,
  accessToken: String,
  expiresIn: Number,
  tokenType: String,
  emittedAt: Number,
});

export const SettingsModel = mongoose.model('settings', SettingsSchema);
