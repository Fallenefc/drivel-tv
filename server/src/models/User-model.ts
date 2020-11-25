import mongoose from 'mongoose';

export interface UserInterface {
  username: string,
  password: string,
  email: string,
  resetPasswordLink: string,
  _id: string,
  __v?: number
}

const UserSchema: mongoose.Schema<UserInterface> = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  resetPasswordLink: String,
});

export default mongoose.model('User', UserSchema);
