import mongoose from 'mongoose';

const UserInfoSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  streetAddress: { type: String },
  postalCode: { type: String },
  city: { type: String },
  country: { type: String },
  admin: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export const UserInfo = mongoose.models.UserInfo || mongoose.model('UserInfo', UserInfoSchema);