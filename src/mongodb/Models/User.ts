import { Schema, model, Document } from 'mongoose';

const UserModel = new Schema<UserDocument>({
  uid: String,
  name: String,
  cus_comidos: { type: Array, default: [] },
});

export interface UserDocument extends Document {
  uid: string;
  name: string;
  cus_comidos: string[];
}

export interface User {
  uid: string;
  name: string;
  cus_comidos: string[];
}

export default model('users', UserModel);
