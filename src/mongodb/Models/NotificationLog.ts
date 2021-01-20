import { Schema, model, Document } from 'mongoose';

const NotificationLog = new Schema<NotficationLogDocument>({
  chatId: String,
  message: String,
});

export interface NotficationLogDocument extends Document {
  chatId: string;
  message: string;
}

export default model('notifications_logs', NotificationLog);
